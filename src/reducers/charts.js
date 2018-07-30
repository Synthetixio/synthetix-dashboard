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

const initialState = {
  stats: {}
};
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
        let data = action.payload.data.body;
        return {
          ...chartData,
          lastUpdated:
            data.HavvenMarketCap.data[data.HavvenMarketCap.data.length - 1]
              .created,
          stats: {
            havvenMarketCapUsd24hDelta: data.HavvenMarketCap.usd24hDelta,
            havvenPriceCapUsd24hDelta: data.HavvenPrice.usd24hDelta,
            nominMarketCapUsd24hDelta: data.NominMarketCap.usd24hDelta,
            nominPriceCapUsd24hDelta: data.NominPrice.usd24hDelta,
            havvenMarketCapUsd:
              data.HavvenMarketCap.data[data.HavvenMarketCap.data.length - 1]
                .usdValue,
            havvenPriceCapUsd:
              data.HavvenPrice.data[data.HavvenPrice.data.length - 1].usdValue,
            nominMarketCapUsd:
              data.NominMarketCap.data[data.NominMarketCap.data.length - 1]
                .usdValue,
            nominPriceCapUsd:
              data.NominPrice.data[data.NominPrice.data.length - 1].usdValue
          }
        };
      } catch (e) {
        console.log("error", e);
        return state;
      }

    default:
      return state;
  }
};
