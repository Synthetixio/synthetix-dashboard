import { FETCH_CHARTS, SET_PERIOD_CHART } from './actionTypes.js'

export const fetchCharts = () => ({
  type: FETCH_CHARTS
});

export const setPeriod = (period, token) => ({
  type: SET_PERIOD_CHART,
  period,
  token
});