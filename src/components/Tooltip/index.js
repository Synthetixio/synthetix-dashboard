import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import styles from "./styles";

class GraphTooltip extends React.Component {

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    orientation: PropTypes.string,
    datum: PropTypes.object
  };

  render () {
    const { scatterX, scatterY, scatterYBtc, scatterYEth, x, y } = this.props;
console.log(this.props)
    return (
      <g style={{pointerEvents: 'none'}}>
        <foreignObject x={x} y={y} width="170" height="150">
          <div className={[styles.container]}>
            <div><span className={styles.dateSm}>{moment(scatterX).format('Do MMMM YYYY').toUpperCase()}</span></div>
            <div><span className={[styles.value]}>{scatterY.toString()}</span><span className={[styles.USD]}>USD</span></div>

            {scatterYBtc && <div><span className={[styles.value]}>{scatterYBtc.toString()}</span><span className={styles.BTC}>BTC</span></div>}
            {scatterYEth && <div><span className={[styles.value]}>{scatterYEth.toString()}</span><span className={styles.ETH}>ETH</span></div>}

            </div>
        </foreignObject>
      </g>
  );
  }
  }

  export default GraphTooltip;