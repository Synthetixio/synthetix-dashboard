import { FETCH_CHARTS_SUCCESS, SET_PERIOD_CHART } from "../actions/charts";
import { parseChartData } from "../utils";

const chartTypes = [
  "HavvenMarketCap",
  "NominMarketCap",
  "HavvenPrice",
  "NominPrice",
  "HavvenVolume24h",
  "NominVolume24h",
  "NominFeesCollected",
  // "LockedUpHavven",
  "LockedUpHavvenRatio",
  "UnlockedHavBalance",
  "CollateralizationRatio"
];

const chartTypesHAV = [
  "HavvenMarketCap",
  "HavvenPrice",
  "HavvenVolume24h",
  // "LockedUpHavven",
  "UnlockedHavBalance",
  "LockedUpHavvenRatio",
];

const chartTypesNomin = [
  "NominMarketCap",
  "NominPrice",
  "NominVolume24h",
  "NominFeesCollected",
  "CollateralizationRatio",
];

const initialState = {
  stats: {},
  havPeriod: "ALL",
  nUSDPeriod: "ALL"
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
          sourceData: data,
          havPeriod: state.havPeriod,
          nUSDPeriod: state.nUSDPeriod,
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
            // lockedUpHavven:
            //   data.LockedUpHavven.data[data.LockedUpHavven.data.length - 1]
            //     .usdValue,
            UnlockedHavBalance:
              data.UnlockedHavBalance.data[data.UnlockedHavBalance.data.length - 1]
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

    case SET_PERIOD_CHART:

      try {
        const { token, period } = action;
        if(!token || !period)
          throw 'Error: Set chart period parameter missing!';
        const types = token === "HAV" ? chartTypesHAV : chartTypesNomin;
        const havPeriod = token === "HAV" ? period : state.havPeriod;
        const nUSDPeriod = token === "nUSD" ? period : state.nUSDPeriod;

        const chartData = types
          .map(type => ({
            [type]: parseChartData(state.sourceData[type].data, type, period)
          }))
          .reduce((acc, next) => ({ ...acc, ...next }), {});

          return {
            ...state,
            ...chartData,
            havPeriod,
            nUSDPeriod,
          };
      } catch (e) {
        console.log("error", e);
        return state;
      }

    default:
      return state;
  }
};
