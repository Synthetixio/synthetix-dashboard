import { FETCH_CHARTS_SUCCESS } from "../actions/charts";
import { parseChartData } from "../utils";

const chartTypes = [
  "HavvenMarketCap",
  "NominMarketCap",
  "HavvenPrice",
  "NominPrice",
  "HavvenVolume24h",
  "NominVolume24h",
  "NominFeesCollected",
  "NominVelocity",
  "LockedUpHavven",
  "LockedUpHavvenRatio",
  "CollateralizationRatio"
];

const initialState = {};
chartTypes.forEach(type => (initialState[type] = {}));

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHARTS_SUCCESS:
      try {
        const chartData = chartTypes
          .map(type => ({
            [type]: parseChartData(action.payload.data.body[type].data, type)
          }))
          .reduce((acc, next) => ({ ...acc, ...next }), {});
        return {
          ...chartData,
          lastUpdated: new Date()
        };
      } catch (e) {
        console.log("error", e);
        return state;
      }

    default:
      return state;
  }
};
