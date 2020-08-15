import http from "./httpService";
import jwtDecode from "jwt-decode";

const registerApiEndpoint = "users"; // register用

const loginApiEndpoint = "auth"; // login用

const token = "token";

http.setJWT(getJWT());

export function getJWT() {
  return localStorage.getItem(token);
}

export async function login(user) {
  // login後，我們需要回傳的res.data，就是jSON web token
  const { data: JWT } = await http.post(loginApiEndpoint, user);
  localStorage.setItem(token, JWT); // 參1是localStorage key為string型態，參2是value，也是string型態
}

export async function register(user) {
  // register後，我們需要回傳res.headers中客製化的x-auth-token
  const res = await http.post(registerApiEndpoint, user);
  localStorage.setItem(token, res.headers["x-auth-token"]);
}

export function getAuthUser() {
  try {
    const jwt = localStorage.getItem(token);
    return jwtDecode(jwt); // user物件
  } catch (ex) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(token);
}

export default {
  login,
  register,
  getAuthUser,
  logout,
  getJWT,
};
