// 中介體需要用到currying，N個參數轉換成N次1個參數
// param，將中介體參數化
const logger = (param) => (store) => (next) => (action) => {
  // console.log("Logging", param);
  //   console.log("store", store); // 中介體的store跟redux的store是不同的
  //   console.log("next", next); // next參照reducer
  //   console.log("action", action);
  return next(action); // next(action)，會將action丟到下一個中介體運作，或是最後到reducer處理
};

export default logger;
