import _ from "lodash";

export const parseChartData = (sourceData, key) => {
  let timeSeries = [];
  let modulo = Math.floor(sourceData.length / 100);
  if (modulo < 1) modulo = 1;
  // optimization to show about 100 data points for all charts
  sourceData.forEach((o, i) => {
    if (i % modulo === 0) timeSeries.push(o);
  });
  let last = sourceData[sourceData.length - 1];
  if (timeSeries[timeSeries.length - 1].createdUnix !== last.createdUnix) {
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

  let minValueUsd = _.minBy(timeSeries, o => o.usdValue).usdValue;
  let minValueBtc = _.minBy(timeSeries, o => o.btcValue);
  minValueBtc = (minValueBtc && minValueBtc.btcValue) || 0;
  let minValueEth = _.minBy(timeSeries, o => o.ethValue);
  minValueEth = (minValueEth && minValueEth.ethValue) || 0;

  let maxValueUsd = _.maxBy(timeSeries, o => o.usdValue).usdValue;
  let maxValueBtc = _.maxBy(timeSeries, o => o.btcValue);
  maxValueBtc = (maxValueBtc && maxValueBtc.btcValue) || 0;
  let maxValueEth = _.maxBy(timeSeries, o => o.ethValue);
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
