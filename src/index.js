import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import logger from "./components/service/logService";

logger.init();
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
