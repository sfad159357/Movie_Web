import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ user }) {
  const style = { color: "grey" };
  const activeStyle = {
    fontWeight: "bold",
    color: "black",
  };
  return (
    <nav className="nav nav-light bg-light mb-5" style={{ display: "flex" }}>
      <span className="nav-brand mb-2 m-2 h4">Vidly</span>
      <NavLink
        to="/movies"
        className="nav-item nav-link m-1"
        style={style}
        activeStyle={activeStyle}
      >
        Movies
      </NavLink>
      <NavLink
        to="/customers"
        className="nav-item nav-link m-1"
        style={style}
        activeStyle={activeStyle}
      >
        Customers
      </NavLink>
      <NavLink
        to="/rentals"
        className="nav-item nav-link m-1"
        style={style}
        activeStyle={activeStyle}
      >
        Rentals
      </NavLink>
      {user && ( // 假設user已登入，user物件存在，user為true，顯示下面2個Navbar user.name, logout
        <>
          <NavLink
            to="/profile" // 個人檔案
            className="nav-item nav-link m-1 "
            style={style}
            activeStyle={activeStyle}
          >
            {user.name}
          </NavLink>
          <NavLink
            to="/logout"
            className="nav-item nav-link m-1 "
            style={style}
            activeStyle={activeStyle}
          >
            Logout
          </NavLink>
        </>
      )}
      {!user && ( // 假設user沒登入，user物件不存在，!user為true，顯示下面2個Navbar login, register
        <>
          <NavLink
            to="/login"
            className="nav-item nav-link m-1 "
            style={style}
            activeStyle={activeStyle}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="nav-item nav-link m-1 "
            style={style}
            activeStyle={activeStyle}
          >
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
}
