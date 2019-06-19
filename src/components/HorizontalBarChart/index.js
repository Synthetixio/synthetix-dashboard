import React, { Component } from 'react';
import './styles.sass';

class HorizontalBarChart extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className="horizontalBarChart">
        <div className="legend">
          <div>Longs</div>
          <div>Shorts</div>
        </div>
        <div className="verticalSeparator" />
        {data.map(synth => {
          return (
            <div className="barWrapper">
              <div
                style={{
                  left: `calc(100% - ${(100 * synth.x) / synth.z}% + 1px)`,
                }}
                className="bar"
              >
                <div className="synthLabel">{synth.label}</div>
                <div
                  style={{ width: (100 * synth.x) / synth.z + '%' }}
                  className="synthBar"
                />
                <div
                  style={{ width: (100 * synth.y) / synth.z + '%' }}
                  className="inverseSynthBar"
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
