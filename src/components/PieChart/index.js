import React, { Component } from 'react';
import { VictoryPie } from 'victory';

const LINE_COLOR = ['#D9AB44', '#D42351', '#53B167', '#42217E'];

class PieChart extends Component {
  render() {
    const { data } = this.props;
    return (
      <VictoryPie
        style={{
          data: {
            fillOpacity: 0.75,
          },
          labels: { fill: 'white', fontSize: 10 },
        }}
        colorScale={LINE_COLOR}
        height={250}
        data={data}
      />
    );
  }
}

export default PieChart;
