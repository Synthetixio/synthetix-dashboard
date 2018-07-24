import React from "react";
import ReactDOM from "react-dom";
import "@babel/polyfill";
import { AppContainer } from "react-hot-loader";
import App from "./App";
import { Provider } from "mobx-react";
import RootStore from "./stores/RootStore";

let rootStore = new RootStore();
rootStore.dashboard.loadData();

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider {...rootStore}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById("root")
  );
};

render(App);

if (process.env.NODE_ENV === "development" && module.hot) {
  window.store = rootStore;
  module.hot.accept("./App", () => {
    render(App);
  });
}
