import React from "react";
import ReactDOM from "react-dom";
import "@babel/polyfill";
import { AppContainer } from "react-hot-loader";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "mobx-react";
import RootStore from "./stores/RootStore";

let rootStore = new RootStore();
rootStore.dashboard.loadData();

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider {...rootStore}>
        <HashRouter>
          <Component />
        </HashRouter>
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
