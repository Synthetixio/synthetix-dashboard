import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import "@babel/polyfill";
import { AppContainer } from "react-hot-loader";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./config/store";
import "styling/bulma/bulma.sass";
import "styling/main.sass";

import HavMarketsComponent from "./components/Markets/HavMarkets"
import NusdMarketsComponent from "./components/Markets/NusdMarkets"


let storedThemeData = window.localStorage.getItem("havven-dashboard");
let data = JSON.parse(storedThemeData);
let theme = data?.theme?.theme || "dark";
if (theme === "dark") {
  require("styling/dark.sass");
} else {
  require("styling/light.sass");
}

const Main = () => {
  return(
    <Switch>
      <Route exact path="/" component={ App } />
      <Route path="/buy-nusd" component={ NusdMarketsComponent } />
      <Route path="/buy-hav" component={ HavMarketsComponent } />
    </Switch>
  )
}

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById("root")
  );
};

render(Main);

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./App", () => {
    render(App);
  });
}
