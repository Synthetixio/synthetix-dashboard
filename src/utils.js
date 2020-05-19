import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import uniqBy from 'lodash/uniqBy';

export const CHARTS = {
	DAY: '1D',
	WEEK: '1W',
	MONTH: '1M',
};

export const toPercent = num => num.toFixed(2);

const generateMonthTimestamp = () => {
	const monthDate = new Date();
	monthDate.setMonth(monthDate.getMonth() - 1);
	return parseInt(monthDate.getTime() / 1000);
};

const generateDayTimestamp = () => {
	const dayDate = new Date();
	dayDate.setDate(dayDate.getDate() - 1);
	return parseInt(dayDate.getTime() / 1000);
};

const generateWeekTimestamp = () => {
	const dayDate = new Date();
	dayDate.setDate(dayDate.getDate() - 7);
	return parseInt(dayDate.getTime() / 1000);
};

export const generateEndTimestamp = period => {
	if (period == CHARTS.DAY) {
		return generateDayTimestamp();
	}
	return generateMonthTimestamp();
};

const selectPeriod = (sourceData, period) => {
	let endTimestamp;
	if (period === CHARTS.DAY) {
		endTimestamp = generateDayTimestamp();
	} else if (period === CHARTS.WEEK) {
		endTimestamp = generateWeekTimestamp();
	} else {
		return sourceData;
	}
	const endIndex = sourceData.findIndex(
		({ created }) => parseInt(new Date(created).getTime() / 1000) < endTimestamp
	);
	return sourceData.slice(0, endIndex);
};

export const parseChartData = (sourceData, key, period = CHARTS.DAY) => {
	const dataSelected = selectPeriod(sourceData, period);

	let reverseTimeSeries = [];
	let modulo = Math.floor(dataSelected.length / 100);
	if (modulo < 1) modulo = 1;
	// optimization to show about 100 data points for all charts
	dataSelected.forEach((o, i) => {
		if (i % modulo === 0) reverseTimeSeries.push(o);
	});
	const timeSeries = reverseTimeSeries.reverse();

	const minValueUsd = minBy(timeSeries, o => o.usdValue).usdValue;
	let minValueEth = minBy(timeSeries, o => o.ethValue);
	minValueEth = (minValueEth && minValueEth.ethValue) || 0;

	const maxValueUsd = maxBy(timeSeries, o => o.usdValue).usdValue;
	let maxValueEth = maxBy(timeSeries, o => o.ethValue);
	maxValueEth = (maxValueEth && maxValueEth.ethValue) || 0;

	const data = {
		timeSeriesUsd: timeSeries.map(o => ({ x: o.created, y: Number(o.usdValue) })),
		timeSeriesEth: timeSeries.map(o => ({ x: o.created, y: o.ethValue })),
		timeSeriesX: timeSeries.map(o => o.created),
		minValueUsd: Number(minValueUsd),
		minValueEth,
		maxValueUsd: Number(maxValueUsd),
		maxValueEth,
		fromDate: timeSeries[0].created,
		toDate: timeSeries[timeSeries.length - 1].created,
		displayName: key,
		currentUsd: Number(timeSeries[timeSeries.length - 1].usdValue),
		currentEth: timeSeries[timeSeries.length - 1].ethValue,
	};
	return data;
};

export const formatNewChartsDataToMatchOld = (snxExchangeData, sUSDExchangeData) => {
	// NOTE these methods are nearly identical but I am not going to get too abstract and make them
	// a single method helper, as this part of the code will go away soon enough and it is not as
	// readable when combining them in one method
	const snxData = uniqBy(snxExchangeData, 'timestamp').reduce(
		(
			acc,
			{ ethBalance, tokenBalance, tokenPriceUSD, timestamp, tradeVolumeEth, tradeVolumeToken },
			index,
			arr
		) => {
			const created = new Date(timestamp * 1000).toISOString();
			acc.HavvenPrice.data.push({
				ethValue: ethBalance / tokenBalance,
				usdValue: tokenPriceUSD,
				created,
			});
			const usdValue =
				index === arr.length - 1
					? 0
					: (tradeVolumeToken - arr[index + 1]['tradeVolumeToken']) * tokenPriceUSD;
			const etherPrice = (tokenBalance / ethBalance) * tokenPriceUSD;
			const ethValue = usdValue / etherPrice;
			acc.HavvenVolume24h.data.push({
				ethValue,
				usdValue,
				created,
			});
			return acc;
		},
		{ HavvenPrice: { data: [] }, HavvenVolume24h: { data: [] } }
	);

	const sUSDData = uniqBy(sUSDExchangeData, 'timestamp').reduce(
		(
			acc,
			{ ethBalance, tokenBalance, tokenPriceUSD, timestamp, tradeVolumeEth, tradeVolumeToken },
			index,
			arr
		) => {
			const created = new Date(timestamp * 1000).toISOString();
			acc.NominPrice.data.push({
				ethValue: ethBalance / tokenBalance,
				usdValue: tokenPriceUSD,
				created,
			});
			const usdValue =
				index === arr.length - 1
					? 0
					: (tradeVolumeToken - arr[index + 1]['tradeVolumeToken']) * tokenPriceUSD;
			const etherPrice = (tokenBalance / ethBalance) * tokenPriceUSD;
			const ethValue = usdValue / etherPrice;
			acc.NominVolume24h.data.push({
				ethValue,
				usdValue,
				created,
			});
			return acc;
		},
		{ NominPrice: { data: [] }, NominVolume24h: { data: [] } }
	);

	return { body: Object.assign({}, snxData, sUSDData) };
};
