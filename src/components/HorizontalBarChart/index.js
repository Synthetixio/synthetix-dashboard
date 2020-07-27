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
							<div className="synthLabel inverse">{`i${synth.label}: ${numeral(
								synth.totalSupplyShort
							).format('0,0.00')} (${numeral(synth.z - synth.x).format('$0,(0)')})`}</div>

							<div className="synthLabel">{`s${synth.label}: ${numeral(
								synth.totalSupplyLong
							).format('0,0.00')} (${numeral(synth.x).format('$0,(0)')})`}</div>
							<div className="barWrapper">
								<div
									style={{
										left: `calc(100% - ${(100 * synth.totalSupplyShort) /
											(synth.totalSupplyLong + synth.totalSupplyShort)}% + 1px)`,
									}}
									className="bar"
								>
									{synth.totalSupplyShort !== 0 && (
										<div
											style={{
												width:
													(100 * synth.totalSupplyShort) /
														(synth.totalSupplyShort + synth.totalSupplyLong) +
													'%',
											}}
											className="inverseSynthBar"
										/>
									)}
									{synth.totalSupplyLong !== 0 && (
										<div
											style={{
												width:
													(100 * synth.totalSupplyLong) /
														(synth.totalSupplyLong + synth.totalSupplyShort) +
													'%',
											}}
											className="synthBar"
										/>
									)}
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
