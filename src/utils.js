import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';

export const CHARTS = {
	DAY: '1D',
	WEEK: '1W',
	MONTH: '1M',
};

export const twoDigitNumber = num => num.toFixed(2);

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
	let formattedSourceData = sourceData;
	if ((key === 'synthsVolume' || key === 'synthsFees') && period === CHARTS.MONTH) {
		formattedSourceData = normalizeMonthlySynthData(sourceData);
	}
	const dataSelected = selectPeriod(formattedSourceData, period);

	let reverseTimeSeries = [];
	let modulo = Math.floor(dataSelected.length / 100);
	if (key === 'synthsVolume' || key === 'synthsFees') {
		modulo /= 4;
	}
	if (modulo < 1) {
		modulo = 1;
	}
	// optimization to show about 100 data points for all charts
	dataSelected.forEach((o, i) => {
		if (i % modulo === 0) reverseTimeSeries.push(o);
	});
	const timeSeries = reverseTimeSeries.reverse();

	const data = {
		timeSeries: timeSeries.map(o => {
			let created =
				period === CHARTS.DAY
					? moment(o.created).format('HH:00')
					: moment(o.created).format('MM/DD');
			if ((key === 'synthsVolume' || key === 'synthsFees') && period === CHARTS.MONTH) {
				created = moment(o.created)
					.add(1, 'days')
					.format('MM/DD');
			}
			return {
				created,
				usdValue: twoDigitNumber(Number(o.usdValue)),
				ethValue: Number(o.ethValue),
			};
		}),
		displayName: key,
	};
	return data;
};

export const formatSnxChartsDataToMatchOld = snxExchangeData => {
	const snxData = uniqBy(snxExchangeData, 'timestamp').reduce(
		(
			acc,
			{ ethBalance, tokenBalance, tokenPriceUSD, timestamp, tradeVolumeEth, tradeVolumeToken },
			index,
			arr
		) => {
			const created = new Date(timestamp * 1000).toISOString();
			acc.SnxPrice.data.push({
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
			acc.SnxVolume24h.data.push({
				ethValue,
				usdValue,
				created,
			});
			return acc;
		},
		{ SnxPrice: { data: [] }, SnxVolume24h: { data: [] } }
	);

	return { body: { ...snxData } };
};

export const formatSusdChartsDataToMatchOld = sUSDExchangeData => {
	const sUSDData = uniqBy(sUSDExchangeData, 'timestamp').reduce(
		(
			acc,
			{ ethBalance, tokenBalance, tokenPriceUSD, timestamp, tradeVolumeEth, tradeVolumeToken },
			index,
			arr
		) => {
			const created = new Date(timestamp * 1000).toISOString();
			acc.sUSDPrice.data.push({
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
			acc.sUSDVolume24h.data.push({
				ethValue,
				usdValue,
				created,
			});
			return acc;
		},
		{ sUSDPrice: { data: [] }, sUSDVolume24h: { data: [] } }
	);

	return { body: { ...sUSDData } };
};

export const formatSynthsChartsDataToMatchOld = synthsExchangeData => {
	const synthsData = { synthsFees: { data: [] }, synthsVolume: { data: [] } };

	const { monthlyData, fifteenMinuteData } = synthsExchangeData;

	const dayOldTimestamp = generateDayTimestamp();
	const dayOldDate = new Date(dayOldTimestamp * 1000);
	const weekOldTimestamp = generateWeekTimestamp();
	const weekOldDate = new Date(weekOldTimestamp * 1000);

	fifteenMinuteData.forEach(({ id, exchangeUSDTally, totalFeesGeneratedInUSD }) => {
		/**
		 * code commented here is from the Graph implementation which is why 900 is used here
		 * let fifteenMinuteID = timestamp / 900
		 */
		const created = new Date(id * 900 * 1000);
		const formattedTime = created.toISOString();

		const exchangeTallyData = {
			created: formattedTime,
			usdValue: exchangeUSDTally / 1e18,
		};
		const exchangeFeeData = {
			created: formattedTime,
			usdValue: totalFeesGeneratedInUSD / 1e18,
		};

		if (
			(monthlyData != null && weekOldDate < created) ||
			(monthlyData == null && dayOldDate < created)
		) {
			synthsData.synthsFees.data.push(exchangeFeeData);
			synthsData.synthsVolume.data.push(exchangeTallyData);
		}
	});
	if (monthlyData != null) {
		monthlyData.forEach(({ id, exchangeUSDTally, totalFeesGeneratedInUSD }) => {
			/**
			 * code commented here is from the Graph implementation which is why 86400 is used here
			 * let dayID = timestamp / 86400
			 */
			const created = new Date(id * 86400 * 1000);
			const formattedTime = created.toISOString();

			if (weekOldDate > created) {
				synthsData.synthsFees.data.push({
					created: formattedTime,
					usdValue: totalFeesGeneratedInUSD / 1e18,
				});
				synthsData.synthsVolume.data.push({
					created: formattedTime,
					usdValue: exchangeUSDTally / 1e18,
				});
			}
		});
	}

	return { body: { ...synthsData } };
};

/**
 * Note that since we get the weekly data in 15 incremements and the monthly data in daily
 * we need to normalize the first 7 days for the monthly chart. The chart setup will be
 * more flexible in the next version of the codebase.
 */
export const normalizeMonthlySynthData = sourceData => {
	// slice off the good data
	const tempSourceData = [...sourceData];
	const dailyData = tempSourceData.splice(-23);
	// use these fields to pro rate the first day's volume
	let aggregatedCurrentDay = false;
	let aggregatedCurrentDayUsdValue = 0;
	// put the 15 minute data into daily aggregates
	return [
		...tempSourceData.reduce((acc, { created, usdValue }, index) => {
			if (!aggregatedCurrentDay) {
				if (created.slice(-14) == 'T00:00:00.000Z') {
					acc[0] = { created, usdValue: index === 0 ? usdValue : aggregatedCurrentDayUsdValue };
					aggregatedCurrentDay = true;
				} else {
					aggregatedCurrentDayUsdValue += usdValue;
				}
			} else if (created.slice(-14) == 'T00:00:00.000Z') {
				acc[acc.length] = { created, usdValue };
			} else {
				acc[acc.length - 1].usdValue = acc[acc.length - 1].usdValue + usdValue;
			}
			return acc;
		}, []),
		...dailyData,
	];
};

export const calculateInterval = (period, displayName) => {
	if (!displayName) {
		return 1;
	}
	let interval = period === CHARTS.DAY ? 2 : 6;
	if (displayName.startsWith('synths') && period === CHARTS.MONTH) {
		interval = 2;
	} else if (displayName.startsWith('synths') && period === CHARTS.WEEK) {
		interval = 50;
	} else if (displayName.startsWith('synths') && period === CHARTS.DAY) {
		interval = 12;
	} else if (displayName.startsWith('Snx') && period === CHARTS.DAY) {
		interval = 12;
	}

	if (window.innerWidth < 800) {
		if (
			!displayName.startsWith('synths') ||
			(displayName.startsWith('synths') && period === CHARTS.WEEK)
		) {
			interval = interval * 2;
		} else if (displayName.startsWith('synths') && period === CHARTS.MONTH) {
			interval = interval * 3;
		}
	}
	return interval;
};
