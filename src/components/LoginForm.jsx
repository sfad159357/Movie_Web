import React, { Component } from "react";
import Input from "./common/Input";
import Joi from "joi-browser";
import Form from "./common/Form";
import auth from "./service/authService";
import { Redirect } from "react-router-dom";

export class LoginForm extends Form {
  //   username = React.createRef(); // ref物件

  //   componentDidMount() {
  //     this.username.current.focus();
  //   }
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().required().label("Email"), // label可以更改跳出error時的欄位名稱
    password: Joi.string().required().label("Password"),
  };

  //   不用套件的方法2，很麻煩瑣碎
  //   validate2 = () => {
  //     const errors = {};
  //     const { email, password } = this.state.data;
  //     if (email.trim() === "") errors.username = "Username is required"; // 透過String.trim()能將任何位元的空白字元都軋成""無位元字串
  //     if (password.trim() === "") errors.password = "Password is required";
  //     console.log("Object.keys:", Object.keys(errors));
  //     return Object.keys(errors).length === 0 ? {} : errors; // Object.keys可以將物件內所有屬性(key)，轉化成字串型態的陣列:[ "key1", "key",...]
  //   };
  doSubmit = async () => {
    const { state } = this.props.location;
    console.log("location state", state);
    try {
      await auth.login(this.state.data);
      // this.props.history.push("/"); // 我們不要子元件的跳轉，因為這無法讓App.js呼叫CMD，也就是需要母元件被重新載入
      // 如果訪客要訪問被保護元件，而Route的props有記錄被保護元件的location當前位置，所以如果從被保護元件過來，登入後返回被保護元件。
      // 但不一定都是從被保護元件點進login，所以返回"/"首頁
      window.location = state ? state.from : "/";
    } catch (ex) {
      console.log("ex", ex.response);
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getAuthUser()) return <Redirect to="/" />; // 假如訪客已經登入，就不要再讓訪客進入login頁面，直接返回首頁

    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        {this.renderInput("email", "Email")}
        {this.renderInput("password", "Password", "password")}
        {this.renderButton("Login")}
      </form>
    );
  }
}

export default LoginForm;
