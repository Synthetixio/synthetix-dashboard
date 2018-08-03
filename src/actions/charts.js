export const FETCH_CHARTS = "FETCH_CHARTS";
export const FETCH_CHARTS_SUCCESS = "FETCH_CHARTS_SUCCESS";
export const SET_PERIOD_CHART = "SET_PERIOD_CHART";
export const FETCH_CHARTS_ERROR = "FETCH_CHARTS_ERROR";

export const fetchCharts = () => ({
  type: FETCH_CHARTS
});

export const setPeriod = (period, token) => ({
  type: SET_PERIOD_CHART,
  period,
  token
});