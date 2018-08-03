import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
const TICKS = {
  "1D":-24,
  "1W":-168,//24*7,
  "1M":-744,//24*7*31
  "1Y":-8760,//365*24
  "ALL":0
}

const selectPeriod = (sourceData, period) => {
  let data = sourceData.slice(TICKS[period]);
  return data;
}

export const parseChartData = (sourceData, key, period = "ALL") => {
  const dataSelected = selectPeriod(sourceData, period);
  let timeSeries = [];
  let modulo = Math.floor(dataSelected.length / 100);
  if (modulo < 1) modulo = 1;
  // optimization to show about 100 data points for all charts
  dataSelected.forEach((o, i) => {
    if (i % modulo === 0) timeSeries.push(o);
  });
  let last = dataSelected[dataSelected.length - 1];
  if (timeSeries[timeSeries.length - 1].created !== last.created) {
    timeSeries.push(last);
  }
  if (key === "LockedUpHavvenRatio") {
    timeSeries = timeSeries.map(val => ({
      ...val,
      usdValue: val.usdValue * 100
    }));
  }
  if (key === "CollateralizationRatio") {
    timeSeries = timeSeries.map(val => ({
      ...val,
      usdValue: val.usdValue * 100
    }));
  }
  last = timeSeries[timeSeries.length - 1];

  let minValueUsd = minBy(timeSeries, o => o.usdValue).usdValue;
  let minValueBtc = minBy(timeSeries, o => o.btcValue);
  minValueBtc = (minValueBtc && minValueBtc.btcValue) || 0;
  let minValueEth = minBy(timeSeries, o => o.ethValue);
  minValueEth = (minValueEth && minValueEth.ethValue) || 0;

  let maxValueUsd = maxBy(timeSeries, o => o.usdValue).usdValue;
  let maxValueBtc = maxBy(timeSeries, o => o.btcValue);
  maxValueBtc = (maxValueBtc && maxValueBtc.btcValue) || 0;
  let maxValueEth = maxBy(timeSeries, o => o.ethValue);
  maxValueEth = (maxValueEth && maxValueEth.ethValue) || 0;

  let data = {
    timeSeriesUsd: timeSeries.map(o => ({ x: o.created, y: o.usdValue })),
    timeSeriesBtc: timeSeries.map(o => ({ x: o.created, y: o.btcValue })),
    timeSeriesEth: timeSeries.map(o => ({ x: o.created, y: o.ethValue })),
    timeSeriesX: timeSeries.map(o => o.created),
    minValueUsd,
    minValueBtc,
    minValueEth,
    maxValueUsd,
    maxValueBtc,
    maxValueEth,
    fromDate: timeSeries[0].created,
    toDate: timeSeries[timeSeries.length - 1].created,
    displayName: key,
    currentUsd: last.usdValue,
    currentBtc: last.btcValue,
    currentEth: last.ethValue
  };
  return data;
};
