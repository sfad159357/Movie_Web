import axios from "axios";
import * as apiActions from "../api";

// 要使用store的參數中的dispatch
const api = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== apiActions.apiCallBegan.type) return next(action); // 如果action沒有要call api，就是交給下一個中介體，return的功能就是終止剩下的code

  const { url, method, data, onStart, onSuccess, onError } = action.payload;

  // bugs/bugsRequested
  if (onStart) dispatch({ type: onStart }); // 如果請求開始，在redux devTool記錄此action type

  // api/apiCallBegan
  next(action); // 避免被下一個action吞沒，在redux開發工具中看到呼叫api前的apiCalled action的痕跡

  try {
    const response = await axios.request({
      // 透過用request method，再來定義要用哪種HTTP method，然後用物件的方式作為參數
      baseURL: "http://localhost:9001/api/",
      url,
      method, // 預設為get
      data, // body of data，如果用get，就不需要有data
    });

    // general，api/callSuccess，payload用response回覆回來的就好
    dispatch(apiActions.apiCallSuccess(response.data));
    // specific，bugs/bugsReceived，特定要傳送的payload
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    console.log(error);
    // general，api/callFailed
    dispatch(apiActions.apiCallFailed(error.message));
    // specific， bugs/bugsRequestFailed
    if (onError) dispatch({ type: onError, payload: error.message }); // 由於error是物件，必須要其屬性message為string型態，才能序列化
    // 如果path payload的值是物件型態，就變成non-serializable，要為string
  }
};

export default api;
