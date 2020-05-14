import React, { Component } from 'react';
import numeral from 'numeral';
import './styles.sass';

class HorizontalBarChart extends Component {
	render() {
		const { data, isLightMode } = this.props;
		return (
			<div className="horizontalBarChart">
				<div className={`legend ${isLightMode ? 'legendDark' : ''}`}>
					<div>Shorts</div>
					<div>Longs</div>
				</div>
				<div className="verticalSeparator" />
				{data.map((synth, i) => {
					return (
						<div key={i} className="barRow">
							<div className="synthLabel inverse">{`i${synth.label} (${numeral(
								synth.z - synth.x
							).format('$0,(0)')})`}</div>

							<div className="synthLabel">{`s${synth.label} (${numeral(synth.x).format(
								'$0,(0)'
							)})`}</div>
							<div className="barWrapper">
								<div
									style={{
										left: `calc(100% - ${(100 * synth.y) / (synth.x + synth.y)}% + 1px)`,
									}}
									className="bar"
								>
									<div
										style={{ width: (100 * synth.y) / (synth.y + synth.x) + '%' }}
										className="inverseSynthBar"
									/>
									<div
										style={{ width: (100 * synth.x) / (synth.x + synth.y) + '%' }}
										className="synthBar"
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}

export default HorizontalBarChart;
