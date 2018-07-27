import styles from "./styles";
import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import { cx } from "emotion";

const SingleStat = ({ value, trend, label, desc }) => (
  <div className="column is-half-tablet is-one-quarter-desktop">
    <div className={cx("single-stat-box", styles.box)}>
      <div className={styles.statTop(trend >= 0 || !trend)}>
        <h2>{numeral(value).format("$0,0.[000]")}</h2>
        {trend && <div>{numeral(trend).format("+0.00")}%</div>}
      </div>
      <div className={styles.statBottom}>
        <h3>{label}</h3>
        <p>{desc}</p>
      </div>
    </div>
  </div>
);

SingleStat.propTypes = {
  value: PropTypes.number,
  trend: PropTypes.number,
  label: PropTypes.string,
  desc: PropTypes.string
};

export default SingleStat;
