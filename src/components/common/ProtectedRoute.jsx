import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../service/authService";

const user = auth.getAuthUser(); // 取得user物件

export default function ProtectedRoute({
  path,
  component: Component,
  render,
  ...rest // 可能會提供其他給Route的屬性
}) {
  return (
    <Route
      //   path={path}
      {...rest}
      render={(props) => {
        if (!user)
          return (
            <Redirect
              to={{
                pathname: "/login",
                // props.location.pathname，可以記錄目前訪客是在哪個url，其實雖然MovieForm尚未被渲染render出頁面，但是點選了Link，url改變，而ProtectedRoute的path被響應，所以為什麼location.pathname可以紀錄到MovieForm的當前url，而不是記錄到Movie的url
                // 讓loginForm元件的this.props中的location.state新增from屬性，可以讓loginForm元件知道原本訪客是從哪裡來的，讓訪客login後傳送到from的位置
                state: { from: props.location.pathname },
              }}
            />
          );
        // 可能沒有component prop，因為可能要給元件傳遞props屬性，所以有render prop，這裡要的是render(props)的return回傳值
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
}
