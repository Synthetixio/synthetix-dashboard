import React from "react";
import ReactDOM from "react-dom";
import "@babel/polyfill";
// import { AppContainer } from "react-hot-loader";
import App from "./App";
import { Provider } from 'react-redux'
import { store } from "./config/store";



const render = Component => {
  ReactDOM.render(

      <Provider store={store}>
        <Component />
      </Provider>
    ,
    document.getElementById("root")
  );
};

render(App);

// if (process.env.NODE_ENV === "development" && module.hot) {
//   window.store = rootStore;
//   module.hot.accept("./App", () => {
//     render(App);
//   });
// }
