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
}) => {
  let loaded = !isNaN(value);
  return (
    <div
      className="column is-half-tablet is-one-quarter-desktop"
      onClick={onClick}
    >
      <div className="single-stat-box">
        <div className="single-stat-box__bottom">
          <h3>{label}</h3>
          <p>{desc}</p>
        </div>
        <div
          className={cx(
            'single-stat-box__stats',
            loaded ? (trend >= 0 || !trend ? 'is-positive' : 'is-negative') : ''
          )}
        >
          <h2>{loaded && renderFormattedValue(type, value, decimals)}</h2>
          {!isNaN(trend) && <div>{numeral(trend).format('+0.00') + '%'}</div>}
        </div>
      </div>
    </div>
  );
};

SingleStatBox.propTypes = {
  value: PropTypes.number,
  type: PropTypes.string,
  trend: PropTypes.number,
  label: PropTypes.string,
  desc: PropTypes.string,
  decimals: PropTypes.number,
  onClick: PropTypes.func,
};

SingleStatBox.defaultProps = {
  decimals: 2,
};

export default SingleStatBox;
