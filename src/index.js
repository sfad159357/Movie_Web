import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import MovieApp from "./components/MovieApp";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import logger from "./components/service/logService";

logger.init();
console.log("env", process.env);
ReactDOM.render(
  <Router>
    <MovieApp />
  </Router>,
  document.getElementById("root")
);
