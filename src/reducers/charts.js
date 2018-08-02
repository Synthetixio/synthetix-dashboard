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
            havvenMarketCap24hDelta: data.HavvenMarketCap.usd24hDelta,
            havvenPriceCap24hDelta: data.HavvenPrice.usd24hDelta,
            havvenVolume24hDelta: data.HavvenVolume24h.usd24hDelta,
            nominMarketCap24hDelta: data.NominMarketCap.usd24hDelta,
            nominPriceCap24hDelta: data.NominPrice.usd24hDelta,
            nominVolume24hDelta: data.NominVolume24h.usd24hDelta,
            havvenMarketCap:
              data.HavvenMarketCap.data[data.HavvenMarketCap.data.length - 1]
                .usdValue,
            havvenPriceCap:
              data.HavvenPrice.data[data.HavvenPrice.data.length - 1].usdValue,
            havvenVolume24h:
              data.HavvenVolume24h.data[data.HavvenVolume24h.data.length - 1]
                .usdValue,
            lockedUpHavven:
              data.LockedUpHavven.data[data.LockedUpHavven.data.length - 1]
                .usdValue,
            lockedUpHavvenRatio:
              data.LockedUpHavvenRatio.data[
                data.LockedUpHavvenRatio.data.length - 1
              ].usdValue,
            nominMarketCap:
              data.NominMarketCap.data[data.NominMarketCap.data.length - 1]
                .usdValue,
            nominPriceCap:
              data.NominPrice.data[data.NominPrice.data.length - 1].usdValue,
            nominVolume24h:
              data.NominVolume24h.data[data.NominVolume24h.data.length - 1]
                .usdValue,
            nominFeesCollected:
              data.NominFeesCollected.data[
                data.NominFeesCollected.data.length - 1
              ].usdValue,
            collateralizationRatio:
              data.CollateralizationRatio.data[
                data.CollateralizationRatio.data.length - 1
              ].usdValue
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
