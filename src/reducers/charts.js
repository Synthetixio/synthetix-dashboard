import { FETCH_CHARTS_SUCCESS, SET_PERIOD_CHART } from '../actions/actionTypes';
import { parseChartData } from '../utils';

const chartTypes = [
	'HavvenMarketCap',
	'NominMarketCap',
	'HavvenPrice',
	'NominPrice',
	'HavvenVolume24h',
	'NominVolume24h',
];

const chartTypesHAV = ['HavvenMarketCap', 'HavvenPrice', 'HavvenVolume24h'];

const chartTypesNomin = ['NominMarketCap', 'NominPrice', 'NominVolume24h'];

const initialState = {
	stats: {},
	havPeriod: '1W',
	nUSDPeriod: 'ALL',
};

const getInitialPeriod = chartType => {
	if (chartTypesHAV.indexOf(chartType) >= 0) {
		return initialState.havPeriod;
	} else if (chartTypesNomin.indexOf(chartType) >= 0) {
		return initialState.nUSDPeriod;
	} else return 'ALL';
};

chartTypes.forEach(type => (initialState[type] = {}));

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_CHARTS_SUCCESS:
			try {
				let { chartHistoricalData, dashboardData } = action.payload;
				const chartData = chartTypes
					.map(type => {
						const period = getInitialPeriod(type);
						return {
							[type]: parseChartData(chartHistoricalData.body[type].data, type, period),
						};
					})
					.reduce((acc, next) => ({ ...acc, ...next }), {});
				chartHistoricalData = chartHistoricalData.body;
				dashboardData = dashboardData.body;
				return {
					...chartData,
					sourceData: chartHistoricalData,
					havPeriod: state.havPeriod,
					nUSDPeriod: state.nUSDPeriod,
					lastUpdated:
						chartHistoricalData.HavvenMarketCap.data[
							chartHistoricalData.HavvenMarketCap.data.length - 1
						].created,
					stats: {
						havvenMarketCap24hDelta: chartHistoricalData.HavvenMarketCap.usd24hDelta,
						havvenPriceCap24hDelta: chartHistoricalData.HavvenPrice.usd24hDelta,
						havvenVolume24hDelta: chartHistoricalData.HavvenVolume24h.usd24hDelta,
						nominMarketCap24hDelta: chartHistoricalData.NominMarketCap.usd24hDelta,
						nominPriceCap24hDelta: chartHistoricalData.NominPrice.usd24hDelta,
						nominVolume24hDelta: chartHistoricalData.NominVolume24h.usd24hDelta,
						havvenMarketCap:
							chartHistoricalData.HavvenMarketCap.data[
								chartHistoricalData.HavvenMarketCap.data.length - 1
							].usdValue,
						havvenPriceCap:
							chartHistoricalData.HavvenPrice.data[chartHistoricalData.HavvenPrice.data.length - 1]
								.usdValue,
						havvenVolume24h:
							chartHistoricalData.HavvenVolume24h.data[
								chartHistoricalData.HavvenVolume24h.data.length - 1
							].usdValue,
						lockedHavUsdBalance: dashboardData.LockedHavUsdBalance,
						lockedHavRatio: dashboardData.LockedHavRatio,
						nominMarketCap:
							chartHistoricalData.NominMarketCap.data[
								chartHistoricalData.NominMarketCap.data.length - 1
							].usdValue,
						nominPriceCap:
							chartHistoricalData.NominPrice.data[chartHistoricalData.NominPrice.data.length - 1]
								.usdValue,
						nominVolume24h:
							chartHistoricalData.NominVolume24h.data[
								chartHistoricalData.NominVolume24h.data.length - 1
							].usdValue,
						nominFeesCollected: dashboardData.NominFeesCollected,
						networkCollateralizationRatio: dashboardData.NetworkCollateralizationRatio,
						activeCollateralizationRatio: dashboardData.ActiveCollateralizationRatio,
					},
				};
			} catch (e) {
				console.log('error', e);
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
				console.log('error', e);
				return state;
			}

		default:
			return state;
	}
};
