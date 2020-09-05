import { createSlice } from "@reduxjs/toolkit"; // 更簡潔的手法
// import { createAction, createReducer } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

// bugXXX，作為event
// XXXBug，作為command

// createSlice整合actions和reducer
// 創造slice後，有屬性actions和方法reducer
const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false, // 如果正在導入，UI可以訂閱此狀態，然後換成loading UI介面
    lastFetch: null, // 用來暫存上次取得的bugs
  },

  reducers: {
    // actions => action handler

    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    // 使用toolkit，所傳送過來的action.type名稱必須要是bugs/bugsReceived
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },
    // 有哪位user遇到此種bug
    bugAssignToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index].userId = userId; // 新增bug屬性userId，由於state結構扁平化，不用id，而是用userId
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
  },
});
// console.log(slice); // actions fn, reducer fn

// Memorization
// if bugs no change => get unresolved bugs from cache
// 找出未解決的bugs
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs, // output作為下一個selector的input
  // 假如下次bugs陣列沒有改變，直接使用存取上一次的結果，不會再做一次運算
  (bugs) => bugs.list.filter((bug) => !bug.resolved)
);

// 找出某位user有哪些bugs
// 這裡要傳入指定的userId，如此getBugsByUsers是個compose func，第一參為userId，第二參為state
export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  );

export const {
  bugAdded,
  bugResolved,
  bugAssignToUser,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed,
} = slice.actions;

export default slice.reducer;

const url = "bugs"; // 不要hard-coding，因為可能會存放配置檔

// GET，載入bugs data
// () => fn 回傳func，因為middleware thunk的關係，可以回傳函式並賦予兩個參數
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  // moment:目前時間，diff(某時間，時間單位)
  // 分鐘差 = 現在時間 - 暫存時間（第一次發送時，lastFetch給值首次時間戳記)
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  // 分鐘差 小於 10，不再繼續執行dispatch，不會再呼叫api call
  if (diffInMinutes < 10) return;
  // 這樣的機制，是為了能夠使用暫存功能，而不需要再次呼叫api call來取得bugs資源

  // 不是直接回傳的話，要重新dispatch一次
  return dispatch(
    apiCallBegan({
      url,
      method: "GET", // 雖然axios預設的method是get，但為了防止有bug出現，還是要加一下
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type, // bugsReceived還是物件func，要加上其屬性type
      onError: bugsRequestFailed.type,
    })
  );
};

// import axios from "axios";
// export const addBug = (bug) => async (dispatch) => {
//   const response = await axios.request({
//     baseURL: "http://localhost:9001/api",
//     url: "/bugs",
//     method: "post",
//     data: bug,
//   });
//   dispatch(bugAdded(response.data));
// };

// POST，存入bug data
export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: "POST",
    data: bug, // body of request
    onSuccess: bugAdded.type,
  });

export const resolveBug = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "PATCH",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });
export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: url + "/" + bugId,
    method: "PATCH",
    data: { userId }, // body of request
    onSuccess: bugAssignToUser.type,
  });
// createAction，其參數是action.type
// 回傳像action函式，其參數是payload
// 快速定義actions和actionTypes
// payload內的物件，由index.js的store dispatch時宣告
// export const add = createAction("add");
// export const remove = createAction("remove");
// export const resolve = createAction("resolve");

// 參1為起始state，參2為{ key:value }
// 其key是對照action.type
// 其value是reducer函式
// 透過[]，我們可以將key賦予動態變數
// 使用內建immer套件，所以可以用push，因為是immutable的
// export default createReducer([], {
// key:value
// actions: functions (event => event handler)
//   [add.type]: (bugs, action) => {
//     bugs.push({
//       id: ++lastId,
//       description: action.payload.description,
//       resolved: false,
//     });
//   },
//   [resolve.type]: (bugs, action) => {
//     const index = bugs.findIndex((bug) => bug.id === action.payload.id);
//     bugs[index].resolved = true;
//   },
// });

//

// const BUG_ADDED = "bugAdded";
// const BUG_REMOVED = "bugRemoved";
// const BUG_RESOLVED = "bugResolved";

// export const addBug = (description) => ({
//   type: BUG_ADDED,
//   payload: {
//     description: description,
//   },
// });

// export const removeBug = (id) => ({
//   type: BUG_REMOVED,
//   payload: {
//     id: id,
//   },
// });

// export const resolveBug = (id) => ({
//   type: BUG_RESOLVED,
//   payload: { id: id },
// });

// 一開始state會是undefined，所以必須先預設為[]
// 必須為純函式，不能加入DOM，不能加入global state，不能加入api call
// export default function reducer(state = [], action) {
//   switch (action.type) {
//     case addBug.type:
//       return [
//         ...state,
//         {
//           id: ++lastId,
//           description: action.payload.description,
//           resolved: false,
//         },
//       ];
//     case removeBug.type:
//       return state.filter((bug) => bug.id !== action.payload.id);
//     case resolveBug.type:
//       return [
//         ...state.map((bug) =>
//           bug.id === action.payload.id ? { ...bug, resolved: true } : bug
//         ),
//       ];
//     // 如果coding錯誤，無法對照符合的action.type，就直接返回原本的state，否則系統會搞亂掉
//     default:
//       return state;
//   }
// }
