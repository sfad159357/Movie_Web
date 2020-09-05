// 使用@reduxjs/toolkit來減少boilerplate code
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducers";
import logger from "./middleware/logger";
import customFunc from "./middleware/customFunc";
import toast from "./middleware/toast";
import api from "./middleware/api";

// 除了code更簡潔，也可以執行異步action
// function也可沒有實際的名字

export default function () {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), logger(), toast, api], // 我們自己客製的middleware func
  }); // reducer: reducer
}

// import { createStore, applyMiddleware } from "redux";
// import { devToolsEnhancer } from "redux-devtools-extension";

// function configStore() {
//   // 用devToolsEnhancer()可以取代window.xxx...一長串code
//   const store = createStore(
//     reducer,
//     // applyMiddleware(logger)
//     devToolsEnhancer({ trace: true }) // 回傳函式，參數為物件用來配置store enhancer

//     // 那一長串是redux文件中的store enhancer，輸入了才能夠在google chrome瀏覽器使用redux dev tool
//     // window是javascript全域物件，如果有這個擴充工具，然後就去使用它，會回傳新的函式store enhancer，給予新的功能，就是能夠和這個擴充工具做溝通
//     //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   );
//   return store;
// }

// export default configureStore;
