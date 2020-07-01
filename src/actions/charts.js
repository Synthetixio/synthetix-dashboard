import {
	FETCH_SNX_CHARTS,
	FETCH_SUSD_CHARTS,
	FETCH_SYNTHS_CHARTS,
	SET_PERIOD_CHART,
} from './actionTypes';

export const fetchSnxCharts = period => ({
	type: FETCH_SNX_CHARTS,
	payload: { period },
});

export const fetchSusdCharts = period => ({
	type: FETCH_SUSD_CHARTS,
	payload: { period },
});

export const fetchSynthsCharts = period => ({
	type: FETCH_SYNTHS_CHARTS,
	payload: { period },
});

export const setPeriod = (period, token) => ({
	type: SET_PERIOD_CHART,
	period,
	token,
});
