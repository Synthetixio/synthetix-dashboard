import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import numeral from "numeral";
import styles from "./styles";

class GraphTooltip extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    orientation: PropTypes.string,
    datum: PropTypes.object
  };

  render() {
    const {
      scatterX,
      scatterY,
      scatterYBtc,
      scatterYEth,
      x,
      y,
      decimals = { Val: 2, Btc: 4 },
      sign,
      showScatter
    } = this.props;
    const dec = decimals.Val > 0 ? "." + "0".repeat(decimals.Val) : "";
    const decBtc = decimals.Btc > 0 ? "." + "0".repeat(decimals.Btc) : "";
    const base = "0,0";
    const baseVal = sign ? base : "$" + base;

    if(!showScatter)
      return null;

    return (
      <g style={{ pointerEvents: "none" }}>
        <foreignObject x={x} y={y} width="170" height="150">
          <div className={[styles.container]}>
            <div>
              <span className={styles.dateSm}>
                {moment(scatterX)
                  .format("Do MMMM YYYY")
                  .toUpperCase()}
              </span>
            </div>

            <div>
              <span className={[styles.value]}>
                {numeral(scatterY.toString()).format(baseVal + dec)}
              </span>
              <span className={[styles.USD]}>{sign ? sign : "USD"}</span>
            </div>

            {scatterYBtc && (
              <div>
                <span className={[styles.value]}>
                  {numeral(scatterY.toString()).format(base + decBtc)}
                </span>
                <span className={styles.BTC}>BTC</span>
              </div>
            )}
            {scatterYEth && (
              <div>
                <span className={[styles.value]}>
                  {numeral(scatterY.toString()).format(base + decBtc)}
                </span>
                <span className={styles.ETH}>ETH</span>
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  }
}

export default GraphTooltip;
