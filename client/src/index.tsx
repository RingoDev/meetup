import React from "react";
import ReactDOM from "react-dom";
import LandingPage from "./main/LandingPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <LandingPage />
    </Provider>
    ,
  </React.StrictMode>,
  document.getElementById("root"),
);
