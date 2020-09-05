// 中介體函式慣用參數寫法
// (store.dispatch, store.getState)
const customFunc = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === "function") action(dispatch, getState);
  else next(action);
};

export default customFunc;
