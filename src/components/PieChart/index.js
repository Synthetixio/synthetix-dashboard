import React, { Component } from 'react';
import { VictoryPie } from 'victory';
import './styles.sass';

const LINE_COLOR = ['#D9AB44', '#D42351', '#53B167', '#42217E', '#00e2df'];

class PieChart extends Component {
	render() {
		const { data } = this.props;
		return (
			<div className="pieChart">
				<VictoryPie
					style={{
						data: {
							fillOpacity: 0.75,
						},
						labels: { display: 'none' },
					}}
					colorScale={LINE_COLOR}
					height={180}
					data={data}
					padding={{ bottom: 10 }}
				/>
				<div className="pieLegend">
					{data.map((synth, i) => {
						return (
							<div key={i} className="pieLegendElement">
								<span
									style={{ backgroundColor: LINE_COLOR[i] }}
									className="pieLegendElementCircle"
								/>
								{synth.x}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default PieChart;
