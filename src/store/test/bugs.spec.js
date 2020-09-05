import {
  addBug,
  loadBugs,
  resolveBug,
  assignBugToUser,
  getUnresolvedBugs,
  getBugsByUser,
} from "../bugs";
import configureStore from "../configStore";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  // jest的函式，參數也是函式，在執行每個test之前，可以先初始化store和fakeAxios物件
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  // 取得當前bugs物件，裡面已經被reducer儲存data進到bugs state
  const bugsSlice = () => store.getState().entities.bugs;

  // 創造新的的空bugs state，通常是為了塞入其他bug物件
  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  // promise必須要await，並且在函式的參數前輸入async
  // 要在不同中介體回傳物件，logger, toast，在next(action)前return

  // addBug
  it("should add the bug to store if it's saved to the server", async () => {
    // Arrange排列
    const bug = { description: "a" };
    const saveBug = { ...bug, id: 1 };
    fakeAxios.onPost("bugs").reply(200, saveBug);

    // Act行動
    await store.dispatch(addBug(bug));

    // Assert聲明
    expect(bugsSlice().list).toContainEqual(saveBug);
  });

  // addBug,but there is server problem 500
  it("should not add the bug to store if it's not saved to the server", async () => {
    // Arrange排列
    const bug = { description: "a" };
    fakeAxios.onPost("/bugs").reply(500);

    // Act行動
    await store.dispatch(addBug(bug));

    // Assert聲明
    expect(bugsSlice().list).toHaveLength(0);
  });

  // loadBugs
  describe("loading bugs", () => {
    describe("if the bugs exist in the cache", () => {
      it("they should not be fetched from the server again", async () => {
        fakeAxios.onGet("bugs").reply(200, [{ id: 1 }]);

        // 測試發送loadBugs連續兩次，來了解loadBugs()有沒有對server請求兩次
        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        // 透過MockAdapter物件的history屬性，如果有被fakeAxios.get呼叫，history.get陣列中就會多出一個物件來記錄
        // 我們預期結果history.get只有記錄一次get請求，故此陣列的長度只有1
        expect(fakeAxios.history.get.length).toBe(1);
      });
      describe("if the bugs don't exist in the cache", () => {
        it("they should be fetched from the server and put in the store", async () => {
          fakeAxios.onGet("bugs").reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().list).toHaveLength(1);
        });
        describe("loading indicator", () => {
          it("should be true while fetching the bugs", () => {
            // Arrange排列
            // reply()參數也可是函式，可以在當中去測試執行中的state，回傳status和陣列
            fakeAxios.onGet("/bugs").reply(() => {
              expect(bugsSlice().loading).toBe(true);
              return [200, [{ id: 1 }]];
            });
            // 這裡不加await，不等到執行結束，是因為在fetching the bugs時，要去檢查loading indicator是否為true
            store.dispatch(loadBugs());
          });
          it("should be false after bugs are fetched", async () => {
            fakeAxios.onGet("bugs").reply(200, [{ id: 1 }]);

            // loadBugs會await到undefined，因為並不是像其他command回傳action物件，而是回傳thunk函式，所以要在dispatch(apiCallBegan({...}))前加上return
            // 如此一來，store.dispatch()參數裡頭才是回傳apiCallBegan之action物件
            await store.dispatch(loadBugs());
            expect(bugsSlice().loading).toBe(false);
          });
          it("should be false if the server return errors", async () => {
            fakeAxios.onGet("bugs").reply(500);
            await store.dispatch(loadBugs());
            expect(bugsSlice().loading).toBe(false);
          });
        });
      });
    });
  });

  // resolveBug;
  it("should mark the bug as resolved if it's saved to the server", async () => {
    // Arrange排列
    fakeAxios.onPost("bugs").reply(200, { id: 1 });
    fakeAxios.onPatch("bugs/1").reply(200, { id: 1, resolved: true });

    // Act行動
    // 為了要啟動resolveBug，首先需要在store中新增新物件{id:1}
    await store.dispatch(addBug({})); // 新增{}空物件
    await store.dispatch(resolveBug(1)); // 解決物件id:1的bug物件

    // Assert聲明
    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  // cannot resolveBug
  it("should not mark the bug as resolved if it's not saved to the server", async () => {
    // Arrange排列
    fakeAxios.onPost("bugs").reply(200, { id: 1 });
    fakeAxios.onPatch("bugs/1").reply(500);

    // Act行動
    // 為了要啟動resolveBug，首先需要在store中新增新物件{id:1}
    await store.dispatch(addBug({})); // 新增{}空物件
    await store.dispatch(resolveBug(1)); // 解決物件id:1的bug物件

    // Assert聲明
    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  // assignBugToUser, 原理和resolveBug一樣
  it("should assign the bug to user if it's saved to the server", async () => {
    fakeAxios.onPost("bugs").reply(200, { id: 1 });
    fakeAxios.onPatch("bugs/1").reply(200, { id: 1, userId: 3 });

    await store.dispatch(addBug({}));
    await store.dispatch(assignBugToUser(1, 3));

    expect(bugsSlice().list[0].userId).toBe(3);
  });

  // cannot assignBugToUser
  it("should assign the bug to user if it's saved to the server", async () => {
    fakeAxios.onPost("bugs").reply(200, { id: 1 });
    fakeAxios.onPatch("bugs/1").reply(500);

    await store.dispatch(addBug({}));
    await store.dispatch(assignBugToUser(1, 3));

    expect(bugsSlice().list[0].userId).not.toBe(3);
  });

  // getUnresolvedBugs
  // 函式之原型：參數store => 回傳unresolvedBugs
  describe("selector", () => {
    it("getUnresolvedBugs", () => {
      // 創造空的bugs state
      const state = createState();
      // 將測試的data賦予到bugs.list
      state.entities.bugs.list = [
        { id: 1 },
        { id: 2 },
        { id: 3, resolved: true },
      ];
      // 參數是已經含有測試data的state，回傳!resolved = true的陣列
      const result = getUnresolvedBugs(state);
      // 預期會有兩個物件的陣列
      expect(result).toHaveLength(2);
    });
    // getBugsByUser，原理等同getUnresolvedBugs
    it("getBugsByUser", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, userId: 3 },
        { id: 2, userId: 4 },
        { id: 3, userId: 4 },
      ];

      // 篩選出物件為userId:4的陣列
      const result = getBugsByUser(4)(state);

      expect(result).toHaveLength(2);
    });
  });
});
