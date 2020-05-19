import { FETCH_CHARTS_SUCCESS, SET_PERIOD_CHART } from '../actions/actionTypes';
import { CHARTS, parseChartData, formatNewChartsDataToMatchOld } from '../utils';

export const chartTypes = ['HavvenPrice', 'NominPrice', 'HavvenVolume24h', 'NominVolume24h'];

const chartTypesHAV = ['HavvenPrice', 'HavvenVolume24h'];

const chartTypesNomin = ['NominPrice', 'NominVolume24h'];

const initialState = {
	stats: {},
	havPeriod: CHARTS.DAY,
	nUSDPeriod: CHARTS.DAY,
};

const getInitialPeriod = chartType => {
	if (chartTypesHAV.indexOf(chartType) >= 0) {
		return initialState.havPeriod;
	} else if (chartTypesNomin.indexOf(chartType) >= 0) {
		return initialState.nUSDPeriod;
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
					havPeriod: state.havPeriod,
					nUSDPeriod: state.nUSDPeriod,
					lastUpdated:
						chartHistoricalData.body.HavvenPrice.data[
							chartHistoricalData.body.HavvenPrice.data.length - 1
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
				const types = token === 'HAV' ? chartTypesHAV : chartTypesNomin;
				const havPeriod = token === 'HAV' ? period : state.havPeriod;
				const nUSDPeriod = token === 'nUSD' ? period : state.nUSDPeriod;

				const chartData = types
					.map(type => ({
						[type]: parseChartData(state.sourceData[type].data, type, period),
					}))
					.reduce((acc, next) => ({ ...acc, ...next }), {});

				return {
					...state,
					...chartData,
					havPeriod,
					nUSDPeriod,
				};
			} catch (e) {
				return state;
			}

		default:
			return state;
	}
};
