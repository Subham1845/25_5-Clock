import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <App
    githubURL="https://github.com/completejavascript/pomodoro-clock"
    defaultBreakLength="5"
    defaultSessionLength="25"
  />,
  document.getElementById("root")
);
