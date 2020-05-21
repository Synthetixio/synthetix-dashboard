import { FETCH_CHARTS, SET_PERIOD_CHART } from './actionTypes';

export const fetchCharts = period => ({
	type: FETCH_CHARTS,
	payload: { period },
});

export const setPeriod = (period, token) => ({
	type: SET_PERIOD_CHART,
	period,
	token,
});
