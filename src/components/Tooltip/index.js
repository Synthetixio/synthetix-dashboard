import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

class GraphTooltip extends React.Component {

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    orientation: PropTypes.string,
    datum: PropTypes.object
  };

  render () {
    const { scatterX, scatterY, x, y } = this.props;
console.log(this.props)
    return (
      <g style={{pointerEvents: 'none'}}>
        <foreignObject x={x} y={y} width="150" height="100">
          <div className="graph-tooltip">
            <div><span>{moment(scatterX).format('Do MMMM YYYY').toUpperCase()}</span></div>
            <div><span>{scatterY.toString()}</span></div>
            </div>
        </foreignObject>
      </g>
  );
  }
  }

  export default GraphTooltip;