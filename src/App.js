import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import SNXMarkets from './pages/Markets/SNX';
import sUSDMarkets from './pages/Markets/sUSD';
import Dashboard from './pages/Dashboard';
import { SynthetixJSContext } from './index';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			themeCss: '',
			themeCssLoaded: false,
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.theme !== this.props.theme) {
			this.switchTheme();
		}
	}

	componentWillMount() {
		this.switchTheme();
	}

	switchTheme() {
		if (this.props.theme === 'dark') {
			import(`styling/dark.css`).then(res => {
				this.setState({ themeCss: res[0][1] }, () => {
					setTimeout(() => {
						this.setState({ themeCssLoaded: true });
					}, 1200);
				});
			});
		} else {
			import(`styling/light.css`).then(res => {
				this.setState({ themeCss: res[0][1] }, () => {
					setTimeout(() => {
						this.setState({ themeCssLoaded: true });
					}, 1200);
				});
			});
		}
	}

	render() {
		const { themeCssLoaded, themeCss } = this.state;
		const cssAfterLoad = 'html {transition: all 1s ease}';
		return (
			<div>
				<style>{themeCssLoaded ? cssAfterLoad : ''}</style>
				<style>{themeCss}</style>
				<SynthetixJSContext.Consumer>
					{snxjs => (
						<BrowserRouter>
							<Switch>
								<Route
									exact
									path="/"
									render={routeProps => <Dashboard {...routeProps} snxjs={snxjs} />}
								/>
								<Route path="/buy-susd" component={sUSDMarkets} />
								<Route path="/buy-snx" component={SNXMarkets} />
							</Switch>
						</BrowserRouter>
					)}
				</SynthetixJSContext.Consumer>
			</div>
		);
	}
}

const mapStateToProps = state => {
	const { theme } = state;
	return {
		theme: theme.theme,
	};
};

export default connect(
	mapStateToProps,
	{}
)(App);
