import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import format from "date-fns/format";

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
      showScatter,
      period
    } = this.props;
    const dec = decimals.Val > 0 ? "." + "0".repeat(decimals.Val) : "";
    const decBtc = decimals.Btc > 0 ? "." + "0".repeat(decimals.Btc) : "";
    const base = "0,0";
    const baseVal = sign ? base : "$" + base;
    const dtFormat = period === "1D" ? "Do MMMM YYYY HH:00" : "Do MMMM YYYY";

    if (!showScatter) return null;

    return (
      <g style={{ pointerEvents: "none" }}>
        <foreignObject x={x} y={y} width="170" height="150">
          <div className="chart-tooltip-box">
            <div>
              <span className="dateSm">
                {format(scatterX, dtFormat).toUpperCase()}
              </span>
            </div>

            {scatterY && (
              <div>
                <span className="value">
                  {numeral(scatterY.toString()).format(baseVal + dec)}
                </span>
                <span className="USD">{sign ? sign : "USD"}</span>
              </div>
            )}

            {scatterYBtc && (
              <div>
                <span className="value">
                  {numeral(scatterYBtc.toString()).format(base + decBtc)}
                </span>
                <span className="BTC">BTC</span>
              </div>
            )}
            {scatterYEth && (
              <div>
                <span className="value">
                  {numeral(scatterYEth.toString()).format(base + decBtc)}
                </span>
                <span className="ETH">ETH</span>
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  }
}

export default GraphTooltip;
