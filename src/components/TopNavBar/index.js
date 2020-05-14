import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';

class TopNavBar extends React.Component {
	render() {
		const { theme } = this.props;
		return (
			<nav className="navbar" role="navigation" aria-label="main navigation">
				<div className="container">
					<div className="navbar-brand">
						<a className="navbar-item" href="https://synthetix.io">
							<img
								style={{ maxHeight: 'none' }}
								src={`${
									theme === 'dark'
										? '/images/synthetix-logo.svg'
										: '/images/synthetix-logo_black.svg'
								}`}
								alt="Havven"
								width="180"
							/>
						</a>
					</div>
				</div>
			</nav>
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
)(TopNavBar);
