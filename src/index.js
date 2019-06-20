import React from 'react';
import ReactDOM from 'react-dom';

import '@babel/polyfill';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './config/store';
import 'styling/bulma/bulma.sass';
import 'styling/main.sass';

let storedThemeData = window.localStorage.getItem('havven-dashboard');
let data = JSON.parse(storedThemeData);
let theme = data?.theme?.theme || 'dark';

if (theme === 'dark') {
  require('styling/dark.sass');
} else {
  require('styling/light.sass');
}

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
