import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import cx from 'classnames';

const SingleStatBox = ({
  value,
  trend,
  label,
  desc,
  decimals,
  onClick,
  customClass,
  symbol,
  isUSD,
}) => {
  let loaded = !isNaN(value);
  let classes = cx({
    'single-stat-box': true,
    'markets-card': customClass,
  });
  return (
    <div
      className="column is-half-tablet is-one-quarter-desktop"
      onClick={onClick}
    >
      <div className={classes}>
        <div
          className={cx(
            'single-stat-box__stats',
            loaded ? (trend >= 0 || !trend ? 'is-positive' : 'is-negative') : ''
          )}
        >
          <h2>
            {loaded &&
              numeral(value).format(
                `${isUSD ? '$' : ''}0,0.[${'0'.repeat(decimals)}]`
              )}
            <span className="symbol">{symbol}</span>
          </h2>
          {!isNaN(trend) && <div>{numeral(trend).format('+0.00') + '%'}</div>}
        </div>
        <div className="single-stat-box__bottom">
          <h3>{label}</h3>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
};

SingleStatBox.propTypes = {
  value: PropTypes.number,
  trend: PropTypes.number,
  label: PropTypes.string,
  desc: PropTypes.string,
  decimals: PropTypes.number,
  onClick: PropTypes.func,
  customClass: PropTypes.bool,
  symbol: PropTypes.string,
  isUsd: PropTypes.bool,
};

SingleStatBox.defaultProps = {
  decimals: 2,
  isUSD: true,
};

export default SingleStatBox;
