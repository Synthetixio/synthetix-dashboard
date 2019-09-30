import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import cx from 'classnames';

const SingleStat = ({ value, trend, decimals }) => (
	<div className={cx('chart-box__stat', trend >= 0 || !trend ? 'is-positive' : 'is-negative')}>
		<h2>{numeral(value).format(`$0,0.[${'0'.repeat(decimals)}]`)}</h2>
		{trend && <div>{numeral(trend * 100).format('+0.00')}%</div>}
	</div>
);

SingleStat.propTypes = {
	value: PropTypes.number,
	trend: PropTypes.number,
	decimals: PropTypes.number,
};

SingleStat.defaultProps = {
	decimals: 3,
};

export default SingleStat;
