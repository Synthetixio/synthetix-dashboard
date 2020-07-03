import cx from 'classnames';
import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { calculateInterval } from '../../utils';

const LINE_COLOR = {
	yellow: '#D9AB44',
	red: '#F02D2D',
	green: '#53B167',
	purple: '#42217E',
};

const CHART_TYPES = {
	usdValue: 'usdValue',
	ethValue: 'ethValue',
};

export default class Chart extends PureComponent {
	render() {
		const { info, activeButton, period } = this.props;
		const renderType =
			activeButton && activeButton === 'eth' ? CHART_TYPES['ethValue'] : CHART_TYPES['usdValue'];
		const interval = calculateInterval(period, info.displayName);
		return (
			<ResponsiveContainer width="100%" height={500}>
				<AreaChart
					width="100%"
					height={400}
					data={info.timeSeries || []}
					margin={{
						top: 20,
						right: 20,
						left: 20,
						bottom: 40,
					}}
				>
					<defs>
						<linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={LINE_COLOR['purple']} stopOpacity={0.8} />
							<stop offset="95%" stopColor={LINE_COLOR['purple']} stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={LINE_COLOR['green']} stopOpacity={0.8} />
							<stop offset="95%" stopColor={LINE_COLOR['green']} stopOpacity={0} />
						</linearGradient>
					</defs>
					<Label value={info.displayName || ''} offset={0} position="insideTopLeft" />
					<XAxis interval={interval} dataKey="created" axisLine={false} tickLine={false} />
					<Tooltip
						formatter={(amount, name) => {
							let newName = name;
							let newAmount = amount;
							if (name === 'usdValue') {
								newName = 'USD';
								newAmount = `$${new Intl.NumberFormat().format(amount)}`;
							} else if (name === 'ethValue') {
								newName = 'ETH';
							}
							return [newAmount, newName];
						}}
					/>
					{renderType === CHART_TYPES['ethValue'] ? (
						<Area
							type="monotone"
							dataKey="ethValue"
							stackId="1"
							stroke={LINE_COLOR['purple']}
							fillOpacity={1}
							fill="url(#colorEth)"
						/>
					) : null}
					{renderType === CHART_TYPES['usdValue'] ? (
						<Area
							type="monotone"
							dataKey="usdValue"
							stackId="1"
							stroke={LINE_COLOR['green']}
							fillOpacity={1}
							fill="url(#colorUsd)"
						/>
					) : null}
				</AreaChart>
			</ResponsiveContainer>
		);
	}
}
