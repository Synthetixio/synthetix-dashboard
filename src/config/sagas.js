import orderBy from 'lodash/orderBy';
import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects';
import snxData, { pageResults } from 'synthetix-data';
import { SynthetixJs } from 'synthetix-js';

import {
	FETCH_SNX_CHARTS,
	FETCH_SUSD_CHARTS,
	FETCH_SYNTHS_CHARTS,
	FETCH_SNX_CHARTS_SUCCESS,
	FETCH_SUSD_CHARTS_SUCCESS,
	FETCH_SYNTHS_CHARTS_SUCCESS,
	FETCH_OPEN_INTEREST,
	FETCH_OPEN_INTEREST_SUCCESS,
	FETCH_TRADING_VOLUME,
	FETCH_TRADING_VOLUME_SUCCESS,
	FETCH_UNISWAP_DATA,
	FETCH_UNISWAP_DATA_SUCCESS,
	FETCH_NETWORK_DATA,
	FETCH_NETWORK_DATA_SUCCESS,
	FETCH_NETWORK_DEPOT,
	FETCH_NETWORK_DEPOT_SUCCESS,
	FETCH_NETWORK_FEES,
	FETCH_NETWORK_FEES_SUCCESS,
	FETCH_BINARY_OPTIONS_TRANSACTIONS,
	FETCH_BINARY_OPTIONS_TRANSACTIONS_SUCCESS,
	FETCH_BINARY_OPTIONS_MARKETS,
	FETCH_BINARY_OPTIONS_MARKETS_SUCCESS,
	FETCH_SNX_CURRENCY,
	FETCH_SETH_CURRENCY_PRICE,
	FETCH_SETH_CURRENCY_PRICE_SUCCESS,
	FETCH_SUSD_CURRENCY_PRICE,
	FETCH_SUSD_CURRENCY_PRICE_SUCCESS,
	FETCH_SNX_CURRENCY_PRICE,
	FETCH_SNX_CURRENCY_PRICE_SUCCESS,
} from '../actions/actionTypes';

import { doFetch } from './api';
import {
	getUniswapSusdData,
	getUniswapSnxData,
	synthSummaryUtilContract,
	getSynthsExchangeData,
	getUniswapV2SethPrice,
	getCurveLatestSwapPrice,
} from './helpers';
import { generateEndTimestamp, CHARTS } from '../utils';

export const uniswapGraph = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap';
export const uniswapGraphV2 = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

//CHARTS
function* fetchUniswapSnxChartData({ payload: { period } }) {
	const endTimestamp = generateEndTimestamp(period);
	const snxExchangeData = yield getUniswapSnxData(endTimestamp);

	yield put({
		type: FETCH_SNX_CHARTS_SUCCESS,
		payload: {
			data: {
				snxExchangeData,
				period,
			},
		},
	});
}

function* fetchUniswapSusdChartData({ payload: { period } }) {
	const endTimestamp = generateEndTimestamp(period);
	const sUSDExchangeData = yield getUniswapSusdData(endTimestamp);

	yield put({
		type: FETCH_SUSD_CHARTS_SUCCESS,
		payload: {
			data: {
				sUSDExchangeData,
				period,
			},
		},
	});
}

function* fetchSynthetixSynthsChartData({ payload: { period } }) {
	let monthlyData = null;
	const dailyFifteenMinPeriods = 96; // 96 * 15 / 60 = 24
	const maxFifteenMinutePeriods =
		period === CHARTS.DAY ? dailyFifteenMinPeriods : dailyFifteenMinPeriods * 7;
	const fifteenMinuteData = yield call(snxData.exchanges.aggregate, {
		max: maxFifteenMinutePeriods,
		timeSeries: '15m',
	});
	if (period === CHARTS.MONTH) {
		monthlyData = yield call(snxData.exchanges.aggregate, { max: 30, timeSeries: '1d' });
	}

	yield put({
		type: FETCH_SYNTHS_CHARTS_SUCCESS,
		payload: {
			data: {
				synthsExchangeData: {
					monthlyData,
					fifteenMinuteData,
				},
				period,
			},
		},
	});
}

function* fetchSnxChartsCall() {
	yield takeEvery(FETCH_SNX_CHARTS, fetchUniswapSnxChartData);
}

function* fetchSusdChartsCall() {
	yield takeEvery(FETCH_SUSD_CHARTS, fetchUniswapSusdChartData);
}

function* fetchSynthsChartsCall() {
	yield takeEvery(FETCH_SYNTHS_CHARTS, fetchSynthetixSynthsChartData);
}

function* fetchFeePeriodData(period, snxjs) {
	const newRecentFeePeriod = yield snxjs.FeePool.recentFeePeriods(period);
	return {
		feesToDistribute:
			Number(snxjs.ethers.utils.formatEther(newRecentFeePeriod.feesToDistribute)) || 0,
		feesClaimed: Number(snxjs.ethers.utils.formatEther(newRecentFeePeriod.feesClaimed)) || 0,
		rewardsToDistribute:
			Number(snxjs.ethers.utils.formatEther(newRecentFeePeriod.rewardsToDistribute)) || 0,
		rewardsClaimed: Number(snxjs.ethers.utils.formatEther(newRecentFeePeriod.rewardsClaimed)) || 0,
	};
}

// NETWORK
function* fetchNetworkDepotCall({ payload: { snxjs } }) {
	const depositsData = yield snxjs.Depot.totalSellableDeposits();
	const totalSellableDeposits = Number(snxjs.ethers.utils.formatEther(depositsData)) || 0;
	const data = { body: { totalSellableDeposits } };
	yield put({
		type: FETCH_NETWORK_DEPOT_SUCCESS,
		payload: { data },
	});
}

// NETWORK
function* fetchNetworkFeesCall({ payload: { snxjs } }) {
	const recentFeePeriod = yield fetchFeePeriodData(0, snxjs);
	const olderFeePeriod = yield fetchFeePeriodData(1, snxjs);

	const totalRewardsAvailable = olderFeePeriod.rewardsToDistribute;
	const unclaimedFees = olderFeePeriod.feesToDistribute - olderFeePeriod.feesClaimed;
	const unclaimedRewards = olderFeePeriod.rewardsToDistribute - olderFeePeriod.rewardsClaimed;
	const totalFeesAvailable = olderFeePeriod.feesToDistribute + recentFeePeriod.feesToDistribute;
	const data = {
		body: { totalFeesAvailable, totalRewardsAvailable, unclaimedFees, unclaimedRewards },
	};
	yield put({
		type: FETCH_NETWORK_FEES_SUCCESS,
		payload: { data },
	});
}

// NETWORK
function* fetchNetworkDataCall({ payload: { snxjs } }) {
	const toUtf8Bytes = SynthetixJs.utils.formatBytes32String;

	const holders = yield call(snxData.snx.holders, { max: 1000 });
	const [
		unformattedLastDebtLedgerEntry,
		unformattedTotalIssuedSynths,
		unformattedIssuanceRatio,
		unformattedUsdToSnxPrice,
	] = yield Promise.all([
		snxjs.SynthetixState.lastDebtLedgerEntry(),
		snxjs.Synthetix.contract.totalIssuedSynthsExcludeEtherCollateral(toUtf8Bytes('sUSD')),
		snxjs.SynthetixState.issuanceRatio(),
		snxjs.ExchangeRates.rateForCurrency(toUtf8Bytes('SNX')),
	]);

	const lastDebtLedgerEntry = Number(
		snxjs.ethers.utils.formatUnits(unformattedLastDebtLedgerEntry, 27)
	);

	const [totalIssuedSynths, issuanceRatio, usdToSnxPrice] = [
		unformattedTotalIssuedSynths,
		unformattedIssuanceRatio,
		unformattedUsdToSnxPrice,
	].map(val => Number(snxjs.utils.formatEther(val)));

	let snxTotal = 0;
	let snxLocked = 0;
	let stakersTotalDebt = 0;
	let stakersTotalCollateral = 0;

	holders.forEach(({ collateral, debtEntryAtIndex, initialDebtOwnership }) => {
		let debtBalance =
			((totalIssuedSynths * lastDebtLedgerEntry) / debtEntryAtIndex) * initialDebtOwnership;
		let collateralRatio = debtBalance / collateral / usdToSnxPrice;
		// ignore if 0 balance
		//if (Number(collateral) <= 0) continue;
		if (isNaN(debtBalance)) {
			debtBalance = 0;
			collateralRatio = 0;
		}
		const lockedSnx = collateral * Math.min(1, collateralRatio / issuanceRatio);

		if (Number(debtBalance) > 0) {
			stakersTotalDebt += Number(debtBalance);
			stakersTotalCollateral += Number(collateral * usdToSnxPrice);
		}
		snxTotal += Number(collateral);
		snxLocked += Number(lockedSnx);
	});

	const percentLocked = Number((snxLocked / snxTotal) * 100);
	const activeCollateralizationRatio = Number(
		(1 / (stakersTotalDebt / stakersTotalCollateral)) * 100
	);
	const data = { body: { percentLocked, activeCollateralizationRatio, totalIssuedSynths } };

	yield put({
		type: FETCH_NETWORK_DATA_SUCCESS,
		payload: { data },
	});
}

// EXCHANGE
function* fetchExchangeOpenInterest({ payload: { snxjs } }) {
	const SynthSummaryUtil = new snxjs.ethers.Contract(
		synthSummaryUtilContract.address,
		synthSummaryUtilContract.abi,
		snxjs.contractSettings.provider
	);

	const synthTotalSupplies = yield SynthSummaryUtil.synthsTotalSupplies();

	const unsortedOpenInterest = [];
	for (let i = 0; i < synthTotalSupplies[0].length; i++) {
		unsortedOpenInterest.push({
			name: snxjs.ethers.utils.parseBytes32String(synthTotalSupplies[0][i]),
			totalSupply: Number(snxjs.ethers.utils.formatEther(synthTotalSupplies[1][i])),
			value: Number(snxjs.ethers.utils.formatEther(synthTotalSupplies[2][i])),
		});
	}

	const openInterestSynths = snxjs.contractSettings.synths
		.filter(synth => ['crypto', 'index'].includes(synth.category))
		.map(({ name }) => name);

	const openInterest = orderBy(unsortedOpenInterest, 'value', 'desc');

	const shortsAndLongs = orderBy(
		openInterest
			.filter(item => openInterestSynths.includes(item.name))
			.reduce((acc, curr) => {
				const name = curr.name.slice(1);
				const item =
					curr.name[0] === 'i'
						? {
								name,
								shorts: curr.value,
								totalSupplyShort: curr.totalSupply,
						  }
						: {
								name,
								longs: curr.value,
								totalSupplyLong: curr.totalSupply,
						  };
				const existingIndex = acc.findIndex(item => item.name === name);
				if (existingIndex !== -1) {
					acc[existingIndex] = { ...acc[existingIndex], ...item };
				} else {
					acc.push(item);
				}
				return acc;
			}, []),
		'longs',
		'desc'
	);

	yield put({
		type: FETCH_OPEN_INTEREST_SUCCESS,
		payload: { data: { body: { shortsAndLongs, openInterest } } },
	});
}

function* fetchExchangeTradingVolume() {
	const ts = Math.floor(Date.now() / 1e3);
	const oneDayAgo = ts - 3600 * 24;

	const exchanges = yield call(snxData.exchanges.since, { minTimestamp: oneDayAgo });
	const { totalFeesGeneratedInUSD, exchangeUSDTally } = yield call(snxData.exchanges.total);
	const last24Hours = exchanges.reduce((memo, { fromAmountInUSD }) => memo + fromAmountInUSD, 0);
	const data = {
		body: {
			totalFeesGenerated: totalFeesGeneratedInUSD,
			volume: {
				last24Hours,
				total: exchangeUSDTally,
			},
		},
	};

	yield put({
		type: FETCH_TRADING_VOLUME_SUCCESS,
		payload: { data },
	});
}

function* fetchUniswapData({ payload: { snxjs } }) {
	const tickerData = yield call(() =>
		pageResults({
			api: uniswapGraph,
			query: {
				entity: 'exchanges',
				selection: {
					where: {
						tokenSymbol: `\\"sETH\\"`,
						tokenAddress: `\\"${snxjs.sETH.contract.address}\\"`,
					},
				},
				properties: ['id', 'lastPriceUSD', 'ethBalance', 'tokenBalance'],
			},
			max: 1,
		})
	);
	const data = {
		body:
			tickerData && tickerData.length > 0
				? {
						rate: tickerData[0].lastPriceUSD,
						eth: tickerData[0].ethBalance,
						synth: tickerData[0].tokenBalance,
				  }
				: { rate: null, synth: null, eth: null },
	};
	yield put({ type: FETCH_UNISWAP_DATA_SUCCESS, payload: { data } });
}

// MARKETS
function* fetchCurrency(action) {
	const data = yield call(doFetch, action.url);
	yield put(action.success(data));
}

// BINARY OPTIONS
function* fetchBinaryOptionsTransactionsCall() {
	const unformattedOptionTransactions = yield call(snxData.binaryOptions.optionTransactions);
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const optionTransactions = unformattedOptionTransactions.filter(optionTx => {
		return new Date(optionTx.timestamp) > yesterday;
	});
	const data = {
		body: {
			numOptionsTransactions: optionTransactions.length,
		},
	};

	yield put({
		type: FETCH_BINARY_OPTIONS_TRANSACTIONS_SUCCESS,
		payload: { data },
	});
}

// BINARY OPTIONS
function* fetchBinaryOptionsMarketsCall() {
	const unformattedMarkets = yield call(snxData.binaryOptions.markets, { max: 5000 });
	const now = new Date();
	let largestMarket;
	let largestMarketPoolSize;
	const [numMarkets, totalPoolSizes] = unformattedMarkets
		.filter(market => {
			const expiryDate = new Date(market.expiryDate);
			return expiryDate > now;
		})
		.sort((a, b) => {
			return parseFloat(b.poolSize) - parseFloat(a.poolSize);
		})
		.reduce(
			([count, sum], activeMarket, index) => {
				if (index === 0) {
					largestMarket = activeMarket.currencyKey;
					largestMarketPoolSize = parseFloat(activeMarket.poolSize);
				}
				count++;
				sum += parseFloat(activeMarket.poolSize);
				return [count, sum];
			},
			[0, 0]
		);

	const data = {
		body: {
			numMarkets,
			totalPoolSizes,
			largestMarket,
			largestMarketPoolSize,
		},
	};

	yield put({
		type: FETCH_BINARY_OPTIONS_MARKETS_SUCCESS,
		payload: { data },
	});
}

function* fetchSnxPriceCall({ payload: { snxjs } }) {
	const toUtf8Bytes = SynthetixJs.utils.formatBytes32String;
	const unformattedSnxPrice = yield snxjs.ExchangeRates.rateForCurrency(toUtf8Bytes('SNX'));
	const unformattedSnxTotalSupply = yield snxjs.Synthetix.totalSupply();
	const snxPrice = Number(snxjs.utils.formatEther(unformattedSnxPrice));
	const snxTotalSupply = parseInt(snxjs.ethers.utils.formatEther(unformattedSnxTotalSupply)) || 0;

	yield put({
		type: FETCH_SNX_CURRENCY_PRICE_SUCCESS,
		payload: {
			data: {
				snxPrice,
				snxTotalSupply,
			},
		},
	});
}

function* fetchSethPriceCall({ payload: { snxjs } }) {
	const sethPriceData = yield getUniswapV2SethPrice(snxjs);

	if (sethPriceData && sethPriceData.length > 0 && sethPriceData[0].priceUSD) {
		yield put({
			type: FETCH_SETH_CURRENCY_PRICE_SUCCESS,
			payload: {
				data: {
					sethPrice: sethPriceData[0].priceUSD,
				},
			},
		});
	}
}

function* fetchSusdPriceCall({ payload: { snxjs } }) {
	const susdPriceData = yield getCurveLatestSwapPrice(snxjs);
	yield put({
		type: FETCH_SUSD_CURRENCY_PRICE_SUCCESS,
		payload: {
			data: {
				susdPrice: susdPriceData,
			},
		},
	});
}

function* fetchSnxCurrencyCall() {
	yield takeEvery(FETCH_SNX_CURRENCY, fetchCurrency);
}

function* fetchOpenInterest() {
	yield takeEvery(FETCH_OPEN_INTEREST, fetchExchangeOpenInterest);
}

function* fetchTradingVolume() {
	yield takeEvery(FETCH_TRADING_VOLUME, fetchExchangeTradingVolume);
}

function* fetchUniswapDataCall() {
	yield takeLatest(FETCH_UNISWAP_DATA, fetchUniswapData);
}

function* fetchNetworkData() {
	yield takeLatest(FETCH_NETWORK_DATA, fetchNetworkDataCall);
}

function* fetchNetworkDepot() {
	yield takeLatest(FETCH_NETWORK_DEPOT, fetchNetworkDepotCall);
}

function* fetchNetworkFees() {
	yield takeLatest(FETCH_NETWORK_FEES, fetchNetworkFeesCall);
}

function* fetchBinaryOptionsTransactions() {
	yield takeLatest(FETCH_BINARY_OPTIONS_TRANSACTIONS, fetchBinaryOptionsTransactionsCall);
}

function* fetchBinaryOptionsMarkets() {
	yield takeLatest(FETCH_BINARY_OPTIONS_MARKETS, fetchBinaryOptionsMarketsCall);
}

function* fetchSnxPrice() {
	yield takeLatest(FETCH_SNX_CURRENCY_PRICE, fetchSnxPriceCall);
}

function* fetchSethPrice() {
	yield takeLatest(FETCH_SETH_CURRENCY_PRICE, fetchSethPriceCall);
}

function* fetchSusdPrice() {
	yield takeLatest(FETCH_SUSD_CURRENCY_PRICE, fetchSusdPriceCall);
}

const rootSaga = function*() {
	yield all([
		fetchSnxChartsCall(),
		fetchSusdChartsCall(),
		fetchSynthsChartsCall(),
		fetchSnxCurrencyCall(),
		fetchOpenInterest(),
		fetchTradingVolume(),
		fetchUniswapDataCall(),
		fetchNetworkData(),
		fetchNetworkFees(),
		fetchNetworkDepot(),
		fetchBinaryOptionsTransactions(),
		fetchBinaryOptionsMarkets(),
		fetchSnxPrice(),
		fetchSethPrice(),
		fetchSusdPrice(),
	]);
};

export default rootSaga;
