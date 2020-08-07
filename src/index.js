import React from 'react';
import ReactDOM from 'react-dom';
import { SynthetixJs } from 'synthetix-js';

import '@babel/polyfill';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './config/store';
import './styling/bulma/bulma.sass';
import './styling/main.sass';

const storedThemeData = window.localStorage.getItem('snx-dashboard');
const data = JSON.parse(storedThemeData);
const theme = data?.theme?.theme || 'dark';

if (theme === 'dark') {
	require('styling/dark.sass');
} else {
	require('styling/light.sass');
}

export const SynthetixJSContext = React.createContext(null);

const snxjs = new SynthetixJs();

const render = () => {
	ReactDOM.render(
		<AppContainer>
			<SynthetixJSContext.Provider value={snxjs}>
				<Provider store={store}>
					<App />
				</Provider>
			</SynthetixJSContext.Provider>
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
