import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import "@babel/polyfill";
import { AppContainer } from "react-hot-loader";
import App from "./App";
import NusdMarkets from "./components/NusdMarkets";
import { Provider } from "react-redux";
import { store } from "./config/store";
import "styling/bulma/bulma.sass";
import "styling/main.sass";

let storedThemeData = window.localStorage.getItem("havven-dashboard");
let data = JSON.parse(storedThemeData);
let theme = data?.theme?.theme || "dark";
if (theme === "dark") {
  require("styling/dark.sass");
} else {
  require("styling/<l>45678 </l>ight.sass");
}

const Main = () => {
  return(
    <Switch>
      <Route exact path="/" component={ App } />
      <Route path="/nusd-markets" component={ NusdMarkets } />
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
