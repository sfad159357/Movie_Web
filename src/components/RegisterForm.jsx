import React, { Component } from "react";
import Form from "./common/Form";
import Joi from "joi-browser";
import auth from "./service/authService";
// import * as userService from "./service/userService";

export class RegisterForm extends Form {
  state = {
    data: { email: "", password: "", name: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().email().trim().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{5,30}$/)
      .required(),
    name: Joi.string().trim().required(),
  };

  doSubmit = async () => {
    try {
      await auth.register(this.state.data);
      // this.props.history.push("/");
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = "此email已有人註冊過了";
        this.setState({ errors });
      }
    }
  };

  render() {
    console.log("data", this.state.data);
    console.log("errors", this.state.errors);
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Register</h1>
        {this.renderInput("email", "Email", "email")}
        {this.renderInput("password", "Password", "password")}
        {this.renderInput("name", "Name")}
        {this.renderButton("Register")}
      </form>
    );
  }
}

export default RegisterForm;
