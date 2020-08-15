import axios from "axios";
import logger from "./logService";
import { toast } from "react-toastify"; // toast其實是個func，但在javascript中func也是種物件
// toast的方法除了error紅色，還有success綠色，info藍色，或是自己toast()當方法白色

// 預設的baseURL就是在axios發送任何請求前都會有個baseURL
axios.defaults.baseURL = process.env.REACT_APP_API_URL; // 此環境變數會隨著是dev還production env而有不同env的值
// 如果在dev env，所連結的後端baseURL就是=http://localhost:3900/api
// 如果在production env，所連結的後端baseURL就是部署在heroku的vidly-api-node連結網址：https://ntense-reef-87676.herokuapp.com/api

// use()內兩個參數都是func，參1代表回覆成功，參2代表回覆有error
// 透過interceptors將全範圍的非預期錯誤先統一處理，再來回傳Promise.reject(error)讓個別func針對預期性錯誤個別處理
axios.interceptors.response.use(null, (error) => {
  console.log("攔截");
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500; // 如果error有response並且status落在400~500範圍，其error為expected

  // 假如為非預期錯誤
  if (!expectedError) {
    console.log("非預期的錯誤：", error);
    logger.log(error); // 我在sentry只記錄非預期性錯誤
    toast.error("發生不知名的錯誤"); // 執行友善及廣泛的錯誤提醒
  }

  return Promise.reject(error); //  無論是否非預期的錯誤，都要將return的結果pass給個別的func的catch做處理
});

// 必須配置jwt到http request中headers裏頭，後端伺服器才能透過此jwt來驗證是否能夠授權來去存取post,put,delete方法
// 此行的目的就是讓axios發送的http請求可以在headers配置我們所想傳遞的屬性['x-auth-token']
// common代表所有的headers所有get, post, put, delete所有方法，我們希望CRUD都可以配置jwt上去
// axios.defaults.headers.common["x-auth-token"] = auth.getJWT(); // 這裡我們不要直接存取localStorage，因為要讓單一模組去管理它
// !!!但不建議這樣做，因為會造成bi-directional dependency雙向依賴

// 不依賴authService導入元件(母)，因為自己是導出元件(子)
export function setJWT(JWT) {
  axios.defaults.headers.common["x-auth-token"] = JWT;
}

// 輸入{}物件形式，有其以下四個方法，各自參照於axios的方法
// 這樣我們可以自由的命名所輸出的物件，不一定要叫axios，也能夠擁有axios的方法
// 我們可以在這http模組更改我們享用的函式庫，不一定要用axios，更換了也不會去影響到主元件，這就是模組化的好處
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJWT,
};
