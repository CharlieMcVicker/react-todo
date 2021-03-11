import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import firebase from "firebase";
import "firebase/firestore";
import { createGlobalStyle } from "styled-components";

var firebaseConfig = {
  apiKey: "AIzaSyB5_NKotM0z-jDPN2-pis3jr654VuHsAdA",
  authDomain: "react-tasks-aa34a.firebaseapp.com",
  projectId: "react-tasks-aa34a",
  storageBucket: "react-tasks-aa34a.appspot.com",
  messagingSenderId: "190524176095",
  appId: "1:190524176095:web:76ef2eab78355202f89b6a",
  measurementId: "G-RHSR8RTEMZ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body, html, #root {
  height: 100vh;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
}
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
