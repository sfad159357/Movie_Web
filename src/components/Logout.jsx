import React, { Component } from "react";
import auth from "./service/authService";

export class Logout extends Component {
  componentDidMount() {
    console.log("logout");
    auth.logout();
    window.location = "/";
  }

  render() {
    return null;
  }
}

export default Logout;
