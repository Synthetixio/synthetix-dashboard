import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import cx from 'classnames';

const renderFormattedValue = (type, value, decimals) => {
	switch (type) {
		case 'percentage':
			return `${numeral(value).format(`0,0.[${'0'.repeat(decimals)}]`)}%`;
		case 'number':
			return `${numeral(value).format(`0,0.[${'0'.repeat(decimals)}]`)}`;
		case 'currency':
		case 'string':
			return value;
		default:
			return numeral(value).format(`$0,0.[${'0'.repeat(decimals)}]`);
	}
};

const SingleStatBox = ({
	value,
	type,
	trend,
	label,
	desc,
	decimals,
	onClick,
	isSmall,
	isClickable,
}) => {
	const loaded = !isNaN(value);
	return (
		<div className="column is-half-tablet is-one-quarter-desktop" onClick={onClick}>
			<div
				className={`single-stat-box ${isSmall ? 'single-stat-box-small' : ''} ${
					isClickable ? 'isClickable' : ''
				}`}
			>
				<div className={`single-stat-box__bottom ${isSmall ? 'single-stat-box-small_bottom' : ''}`}>
					<h3>{label}</h3>
					<div
						className={cx(
							'single-stat-box__stats',
							loaded ? (trend >= 0 || !trend ? 'is-positive' : 'is-negative') : 'is-positive'
						)}
					>
						{loaded || type === 'string' ? (
							<h2>{renderFormattedValue(type, value, decimals)}</h2>
						) : null}

						{!isNaN(trend) && <div>{numeral(trend).format('+0.00') + '%'}</div>}
					</div>
				</div>
				{desc ? <p>{desc}</p> : null}
			</div>
		</div>
	);
};

SingleStatBox.propTypes = {
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	type: PropTypes.string,
	trend: PropTypes.number,
	label: PropTypes.string,
	desc: PropTypes.string,
	decimals: PropTypes.number,
	onClick: PropTypes.func,
	isClickable: PropTypes.bool,
};

SingleStatBox.defaultProps = {
	decimals: 2,
};

export default SingleStatBox;
