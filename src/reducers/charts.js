import {
	FETCH_SNX_CHARTS_SUCCESS,
	FETCH_SUSD_CHARTS_SUCCESS,
	FETCH_SYNTHS_CHARTS_SUCCESS,
	SET_PERIOD_CHART,
} from '../actions/actionTypes';
import {
	CHARTS,
	parseChartData,
	formatSnxChartsDataToMatchOld,
	formatSusdChartsDataToMatchOld,
	formatSynthsChartsDataToMatchOld,
} from '../utils';

const chartTypesSNX = ['SnxPrice', 'SnxVolume24h'];

const chartTypessUSD = ['sUSDPrice', 'sUSDVolume24h'];

const chartTypesSynths = ['synthsFees', 'synthsVolume'];

export const chartTypes = [...chartTypesSNX, ...chartTypessUSD, ...chartTypesSynths];

const initialState = {
	stats: {},
	snxPeriod: CHARTS.DAY,
	sUSDPeriod: CHARTS.DAY,
	synthsPeriod: CHARTS.DAY,
};

chartTypes.forEach(type => (initialState[type] = {}));

const mapChartTypes = (types, chartHistoricalData, period) =>
	types
		.map(type => ({
			[type]: parseChartData(chartHistoricalData.body[type].data, type, period),
		}))
		.reduce((acc, next) => ({ ...acc, ...next }), {});

const updateChartsReducerState = (state, chartData, chartHistoricalData) => ({
	...state,
	...chartData,
	sourceData: {
		...state.sourceData,
		...chartHistoricalData.body,
	},
	chartsStartedLoading: true,
});

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_SNX_CHARTS_SUCCESS:
			try {
				const { snxExchangeData, period } = action.payload.data;
				const chartHistoricalData = formatSnxChartsDataToMatchOld(snxExchangeData);
				const chartData = mapChartTypes(chartTypesSNX, chartHistoricalData, period);
				const newState = updateChartsReducerState(state, chartData, chartHistoricalData);
				return {
					...newState,
					snxPeriod: period,
					snxPeriodLoaded: period,
					lastUpdatedSnx:
						chartHistoricalData.body.SnxPrice.data[
							chartHistoricalData.body.SnxPrice.data.length - 1
						].created,
				};
			} catch (e) {
				return state;
			}
		case FETCH_SUSD_CHARTS_SUCCESS:
			try {
				const { sUSDExchangeData, period } = action.payload.data;
				const chartHistoricalData = formatSusdChartsDataToMatchOld(sUSDExchangeData);
				const chartData = mapChartTypes(chartTypessUSD, chartHistoricalData, period);
				const newState = updateChartsReducerState(state, chartData, chartHistoricalData);
				return {
					...newState,
					sUSDPeriod: period,
					sUSDPeriodLoaded: period,
					lastUpdatedSusd:
						chartHistoricalData.body.sUSDPrice.data[
							chartHistoricalData.body.sUSDPrice.data.length - 1
						].created,
				};
			} catch (e) {
				return state;
			}
		case FETCH_SYNTHS_CHARTS_SUCCESS:
			try {
				const { synthsExchangeData, period } = action.payload.data;
				const chartHistoricalData = formatSynthsChartsDataToMatchOld(synthsExchangeData);
				const chartData = mapChartTypes(chartTypesSynths, chartHistoricalData, period);
				const newState = updateChartsReducerState(state, chartData, chartHistoricalData);
				return {
					...newState,
					synthsPeriod: period,
					synthsPeriodLoaded: period,
					lastUpdatedSynths:
						chartHistoricalData.body.synthsFees.data[
							chartHistoricalData.body.synthsFees.data.length - 1
						].created,
				};
			} catch (e) {
				return state;
			}

		case SET_PERIOD_CHART:
			try {
				const { token, period } = action;
				if (!token || !period) throw 'Error: Set chart period parameter missing!';
				let types;
				if (token === 'SNX') {
					types = chartTypesSNX;
				} else if (token === 'sUSD') {
					types = chartTypessUSD;
				} else if (token === 'synths') {
					types = chartTypesSynths;
				} else {
					throw new Error('unrecognized chart type');
				}
				const snxPeriod = token === 'SNX' ? period : state.snxPeriod;
				const sUSDPeriod = token === 'sUSD' ? period : state.sUSDPeriod;
				const synthsPeriod = token === 'synths' ? period : state.synthsPeriod;
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
					synthsPeriod,
				};
			} catch (e) {
				return state;
			}

		default:
			return state;
	}
};
