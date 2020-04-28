import React from 'react';
import PropTypes from 'prop-types';
import {
	VictoryChart,
	VictoryCursorContainer,
	VictoryAxis,
	Line,
	VictoryScatter,
	VictoryLine,
	VictoryArea,
	VictoryTooltip,
} from 'victory';
import GraphTooltip from '../Tooltip';
import format from 'date-fns/format';
import havvenTheme from '../../config/theme';
import { CHARTS } from '../../utils';

const CURRENCY_MAP = ['Usd', 'Eth'];
const LINE_COLOR = {
	yellow: '#D9AB44',
	red: '#F02D2D',
	green: '#53B167',
	purple: '#42217E',
};

export default class HavvenChart extends React.Component {
	constructor(props) {
		super(props);

		const colorGradient = props.colorGradient || 'green';

		this.state = {
			timeSeries: [],
			timeSeriesX: [],
			showScatter: false,
			showChart: false,
			tickerLabelPadding: 48,
			windowWidth: this.getWidth(),
			gradientUrl: `url(#gradient-${colorGradient})`,
			colorGradient,
			decimals: {},
			switchOnCount: this.countSwitchOn(),
		};
	}

	getWidth = () => {
		const w = window.innerWidth;
		const r = w > 1350 ? 1350 : w;
		return r < 769 ? r : this.props.fullSize ? r : r / 2;
	};

	onCursorChange = value => {
		if (value) {
			const { timeSeries, timeSeriesX, timeSeriesEth } = this.state;
			const index = this.findIndexByDate(timeSeriesX, value);
			if (index > -1) {
				const scatterY = timeSeries[index].y;
				const scatterYEth = timeSeriesEth[index].y;

				this.setState({
					scatterX: value,
					scatterY,
					scatterYEth,
				});
			}
		}
	};

	setScatterToLast = () => {
		const { timeSeriesX, timeSeries } = this.state;
		const length = timeSeriesX.length;
		const index = length > 0 ? length - 1 : length;

		if (index !== -1 && index !== undefined) {
			this.setState({
				scatterX: timeSeries[index].x,
				scatterY: timeSeries[index].y,
				//showScatter: true,
				showChart: true,
			});
			this.props.onCursorChange &&
				this.props.onCursorChange(timeSeries[index].y, timeSeries[index].x);
		}
	};

	findIndexByDate(dateArray, date) {
		for (let i = 0; i < dateArray.length - 1; i++) {
			if (date >= dateArray[i] && date <= dateArray[i + 1]) {
				return i;
			}
		}
	}

	updateDimensions = () => {
		this.setState({ windowWidth: this.getWidth() });
	};

	componentDidMount() {
		this.parseProps();
		this.updateDimensions();
		window.addEventListener('resize', this.updateDimensions);
	}

	componentDidUpdate(prevProps) {
		const initialData = this.props.info && !prevProps.info;

		const differentChartData =
			this.props.info &&
			prevProps.info &&
			this.props.info.displayName !== prevProps.info.displayName;

		const freshChartData = prevProps.lastUpdated !== this.props.lastUpdated;

		const periodChanged = prevProps.period !== this.props.period;

		if (initialData || differentChartData || freshChartData || periodChanged) {
			this.parseProps();
		}

		const { currencySwitch } = this.props;
		if (
			(!prevProps.currencySwitch && currencySwitch) ||
			(currencySwitch &&
				(prevProps.currencySwitch.Eth !== currencySwitch.Eth ||
					prevProps.currencySwitch.Usd !== currencySwitch.Usd))
		) {
			const count = this.countSwitchOn();
			const hideScatter = count === 0;
			this.setState({
				showScatter: !hideScatter,
				switchOnCount: count,
			});
		}
	}

	countSwitchOn = () => {
		let count = 0;
		const { currencySwitch } = this.props;
		if (currencySwitch) {
			for (const key in currencySwitch) {
				// eslint-disable-next-line no-prototype-builtins
				if (currencySwitch.hasOwnProperty(key)) {
					if (currencySwitch[key] === true) count++;
				}
			}
		}
		return count;
	};

	parseProps = () => {
		const { info } = this.props;
		if (!info || !info.displayName) return;

		const currency = CURRENCY_MAP[0];
		const data = info;
		const minValue = data && data['minValue' + currency];
		const maxValue = data && data['maxValue' + currency];
		const fromDate = data && new Date(data.fromDate);
		const toDate = data && new Date(data.toDate);

		const timeSeries =
			data &&
			data['timeSeries' + currency].map(val => ({
				x: new Date(val.x),
				y: val.y,
			}));
		const timeSeriesX = data && data.timeSeriesX.map(val => new Date(val));
		const timeSeriesEth =
			data &&
			data['timeSeriesEth'].map(val => ({
				x: new Date(val.x),
				y: val.y,
			}));
		const minValueEth = data && data['minValueEth'];
		const maxValueEth = data && data['maxValueEth'];

		this.setState(
			{
				minValue,
				maxValue,
				minValueEth,
				maxValueEth,
				fromDate,
				toDate,
				timeSeries,
				timeSeriesEth,
				timeSeriesX,
			},
			() => {
				this.setScatterToLast();
			}
		);
	};

	cursorOut = event => {
		event.stopPropagation();
		this.setState({ showScatter: false });
	};

	cursorOver = event => {
		event.stopPropagation();
		this.setState({ showScatter: true });
	};

	render() {
		const {
			timeSeries,
			timeSeriesEth,
			minValue,
			maxValue,
			minValueEth,
			maxValueEth,
			switchOnCount,
		} = this.state;
		const { currencySwitch, period, isLightMode } = this.props;
		const dtFormat = period === CHARTS.DAY ? 'HH:00' : 'DD/MM';
		let ttY = -100;
		if (switchOnCount) {
			ttY -= switchOnCount * 15;
		}

		return (
			<div>
				<svg style={{ height: 0 }}>
					<defs>
						<linearGradient
							x1="55.1525017%"
							y1="-5.72462792%"
							x2="55.1524997%"
							y2="100%"
							id="gradient-green"
						>
							<stop stopColor="#53B167" stopOpacity="0.309669384" offset="0%" />
							<stop stopColor="#53B167" stopOpacity="0" offset="100%" />
						</linearGradient>

						<linearGradient
							x1="55.1525017%"
							y1="-5.72462792%"
							x2="55.1524997%"
							y2="100%"
							id="gradient-yellow"
						>
							<stop stopColor="#D9AB44" stopOpacity="0.499971694" offset="0%" />
							<stop stopColor="#D9AB44" stopOpacity="0" offset="100%" />
						</linearGradient>

						<linearGradient x1="50%" y1="0.952854046%" x2="50%" y2="97.9791366%" id="gradient-red">
							<stop stopColor="#E02254" stopOpacity="0.601364357" offset="0%" />
							<stop stopColor="#E5255D" stopOpacity="0" offset="100%" />
						</linearGradient>
						<linearGradient
							x1="55.1525017%"
							y1="-5.72462792%"
							x2="55.1524997%"
							y2="100%"
							id="gradient-purple"
						>
							<stop stopColor="#42217E" stopOpacity="0.309669384" offset="0%" />
							<stop stopColor="#42217E" stopOpacity="0" offset="100%" />
						</linearGradient>
					</defs>
				</svg>
				<div style={{ position: 'relative' }}>
					{currencySwitch && currencySwitch.Eth && (
						<div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
							<VictoryChart
								domain={{ y: [minValueEth * 0.9, maxValueEth * 1.1] }}
								scale={{ x: 'time' }}
								padding={{ bottom: 40 }}
								theme={havvenTheme}
								domainPadding={{ y: [0, 20] }}
								width={this.state.windowWidth}
							>
								<VictoryAxis
									style={{
										grid: { stroke: 'transparent' },
										axis: { stroke: 'transparent' },
									}}
									tickCount={5}
									tickFormat={t => `${format(t, dtFormat)}`}
								/>

								<VictoryArea
									data={timeSeriesEth}
									style={{
										data: { fill: 'url(#gradient-purple' },
									}}
								/>
								<VictoryLine
									data={timeSeriesEth}
									style={{
										data: { stroke: '#42217E', strokeWidth: 2 },
									}}
								/>
								{this.state.showScatter && (
									<VictoryScatter
										style={{
											data: { fill: isLightMode ? '#25244b' : '#FFFFFF' },
										}}
										data={[
											{
												x: this.state.scatterX,
												y: this.state.scatterYEth,
												symbol: 'circle',
												size: 3,
											},
										]}
									/>
								)}
							</VictoryChart>
						</div>
					)}
					{(!currencySwitch || (currencySwitch && currencySwitch.Usd)) && (
						<div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
							<VictoryChart
								domain={{ y: [minValue * 0.9, maxValue * 1.1] }}
								scale={{ x: 'time' }}
								padding={{ bottom: 40 }}
								theme={havvenTheme}
								domainPadding={{ y: [0, 20] }}
								width={this.state.windowWidth}
							>
								<VictoryAxis
									style={{
										grid: { stroke: 'transparent' },
										axis: { stroke: 'transparent' },
									}}
									tickCount={5}
									tickFormat={t => `${format(t, dtFormat)}`}
								/>

								<VictoryArea
									data={timeSeries}
									style={{
										data: { fill: this.state.gradientUrl },
									}}
								/>
								<VictoryLine
									data={timeSeries}
									style={{
										data: {
											stroke: LINE_COLOR['green'],
											strokeWidth: 2,
										},
									}}
								/>

								{this.state.showScatter && (
									<VictoryScatter
										style={{
											data: { fill: isLightMode ? '#25244b' : '#FFFFFF' },
										}}
										data={[
											{
												x: this.state.scatterX,
												y: this.state.scatterY,
												symbol: 'circle',
												size: 5,
											},
										]}
									/>
								)}
							</VictoryChart>
						</div>
					)}
					<div onMouseOut={this.cursorOut} onMouseOver={this.cursorOver}>
						<VictoryChart
							domain={{ y: [minValue * 0.9, maxValue * 1.1] }}
							scale={{ x: 'time' }}
							padding={{ bottom: 40 }}
							theme={havvenTheme}
							domainPadding={{ y: [0, 20] }}
							width={this.state.windowWidth}
							containerComponent={
								<VictoryCursorContainer
									cursorDimension={'x'}
									cursorComponent={<Line style={{ stroke: 'transparent' }} />}
									onCursorChange={this.onCursorChange}
									cursorLabel={() => ''}
									cursorLabelOffset={{ x: -85, y: ttY }}
									cursorLabelComponent={
										<VictoryTooltip
											flyoutComponent={
												<GraphTooltip
													period={this.props.period}
													showScatter={this.state.showScatter}
													scatterY={
														currencySwitch && !currencySwitch.Usd ? undefined : this.state.scatterY
													}
													scatterX={this.state.scatterX}
													scatterYEth={
														currencySwitch && currencySwitch.Eth && this.state.scatterYEth
													}
													decimals={this.props.decimals}
													sign={this.props.sign}
												/>
											}
										/>
									}
								/>
							}
						>
							<VictoryAxis
								style={{
									grid: { stroke: 'transparent' },
									axis: { stroke: 'transparent' },
								}}
								tickCount={5}
								tickFormat={t => `${format(t, dtFormat)}`}
							/>

							<VictoryLine
								data={timeSeries}
								style={{
									data: {
										stroke: 'transparent',
										strokeWidth: 2,
									},
								}}
							/>

							{this.state.showScatter && (
								<VictoryLine
									style={{
										data: {
											stroke: isLightMode ? '#EBE9F6' : 'rgba(255,255,255,0.15)',
										},
									}}
									data={[
										{ x: this.state.scatterX, y: minValue * 0.9 },
										{ x: this.state.scatterX, y: maxValue * 1.1 },
									]}
								/>
							)}
						</VictoryChart>
					</div>
				</div>
			</div>
		);
	}
}

HavvenChart.propTypes = {
	charts: PropTypes.object,
};
