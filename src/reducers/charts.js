import { FETCH_CHARTS_SUCCESS, SET_PERIOD_CHART } from '../actions/actionTypes';
import { CHARTS, parseChartData, formatNewChartsDataToMatchOld } from '../utils';

export const chartTypes = ['SnxPrice', 'sUSDPrice', 'SnxVolume24h', 'sUSDVolume24h'];

const chartTypesSNX = ['SnxPrice', 'SnxVolume24h'];

const chartTypessUSD = ['sUSDPrice', 'sUSDVolume24h'];

const initialState = {
	stats: {},
	snxPeriod: CHARTS.DAY,
	sUSDPeriod: CHARTS.DAY,
};

const getInitialPeriod = chartType => {
	if (chartTypesSNX.indexOf(chartType) >= 0) {
		return initialState.snxPeriod;
	} else if (chartTypessUSD.indexOf(chartType) >= 0) {
		return initialState.sUSDPeriod;
	} else return CHARTS.DAY;
};

chartTypes.forEach(type => (initialState[type] = {}));

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_CHARTS_SUCCESS:
			try {
				const { snxExchangeData, sUSDExchangeData, period } = action.payload.data;
				const chartHistoricalData = formatNewChartsDataToMatchOld(
					snxExchangeData,
					sUSDExchangeData
				);
				const chartData = chartTypes
					.map(type => {
						const period = getInitialPeriod(type);
						return {
							[type]: parseChartData(chartHistoricalData.body[type].data, type, period),
						};
					})
					.reduce((acc, next) => ({ ...acc, ...next }), {});

				return {
					...chartData,
					sourceData: chartHistoricalData.body,
					snxPeriod: state.snxPeriod,
					sUSDPeriod: state.sUSDPeriod,
					lastUpdated:
						chartHistoricalData.body.SnxPrice.data[
							chartHistoricalData.body.SnxPrice.data.length - 1
						].created,
					periodLoaded: period,
				};
			} catch (e) {
				return state;
			}

		case SET_PERIOD_CHART:
			try {
				const { token, period } = action;
				if (!token || !period) throw 'Error: Set chart period parameter missing!';
				const types = token === 'SNX' ? chartTypesSNX : chartTypessUSD;
				const snxPeriod = token === 'SNX' ? period : state.snxPeriod;
				const sUSDPeriod = token === 'sUSD' ? period : state.sUSDPeriod;

				const chartData = types
					.map(type => ({
						[type]: parseChartData(state.sourceData[type].data, type, period),
					}))
					.reduce((acc, next) => ({ ...acc, ...next }), {});

				return {
					...state,
					...chartData,
					snxPeriod,
					sUSDPeriod,
				};
			} catch (e) {
				return state;
			}

		default:
			return state;
	}
};
