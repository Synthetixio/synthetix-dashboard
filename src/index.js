import React from "react";
import ReactDOM from "react-dom";
import "@babel/polyfill";
import { AppContainer } from "react-hot-loader";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./config/store";
import "styling/bulma/bulma.sass";
import "styling/custom.sass";

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById("root")
  );
};

render(App);

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./App", () => {
    render(App);
  });
}
