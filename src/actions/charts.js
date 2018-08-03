export const FETCH_CHARTS = "FETCH_CHARTS";
export const FETCH_CHARTS_SUCCESS = "FETCH_CHARTS_SUCCESS";
export const PARSE_PERIOD_CHART = "PARSE_PERIOD_CHART";
export const FETCH_CHARTS_ERROR = "FETCH_CHARTS_ERROR";

export const fetchCharts = () => ({
  type: FETCH_CHARTS
});

export const parsePeriod = () => ({
  type: PARSE_PERIOD_CHART
});