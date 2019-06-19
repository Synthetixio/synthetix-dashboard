import React, { Component } from 'react';
import numeral from 'numeral';
import './styles.sass';

class HorizontalBarChart extends Component {
  render() {
    const { data } = this.props;
    const max = data.reduce((acc, curr) => {
      if (curr.z > acc) acc = curr.z;
      return acc;
    }, 0);
    return (
      <div className="horizontalBarChart">
        <div className="legend">
          <div>Shorts</div>
          <div>Longs</div>
        </div>
        <div className="verticalSeparator" />
        {data.map(synth => {
          return (
            <div className="barWrapper">
              <div
                style={{
                  left: `calc(100% - ${(100 * synth.y) / max}% + 1px)`,
                }}
                className="bar"
              >
                <div className="synthLabel">{`${synth.label} (${numeral(
                  synth.z
                ).format('$0,(0)')} total)`}</div>
                <div
                  style={{ width: (100 * synth.y) / max + '%' }}
                  className="inverseSynthBar"
                />
                <div
                  style={{ width: (100 * synth.x) / max + '%' }}
                  className="synthBar"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default HorizontalBarChart;
