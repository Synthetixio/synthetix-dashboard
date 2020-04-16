import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects';

import {
	FETCH_CHARTS,
	FETCH_CHARTS_SUCCESS,
	FETCH_HAV_CURRENCY,
	FETCH_NUSD_CURRENCY,
	FETCH_COINMARKETCAP_HAV,
	FETCH_COINMARKETCAP_NUSD,
	FETCH_OPEN_INTEREST,
	FETCH_OPEN_INTEREST_SUCCESS,
	FETCH_TRADING_VOLUME,
	FETCH_TRADING_VOLUME_SUCCESS,
	FETCH_EXCHANGE_TICKER,
	FETCH_EXCHANGE_TICKER_SUCCESS,
	FETCH_UNISWAP_POOL,
	FETCH_UNISWAP_POOL_SUCCESS,
	FETCH_NETWORK_DATA,
	FETCH_NETWORK_DATA_SUCCESS,
} from '../actions/actionTypes';

import { doFetch } from './api';

import snxData from 'synthetix-data';
import { SynthetixJs } from 'synthetix-js';

const apiUri = process.env.API_URL || 'https://api.synthetix.io/api/';

//CHARTS
function* fetchCharts() {
	const fetchChartUri = apiUri + 'dataPoint/chartData';
	const chartHistoricalData = yield call(doFetch, fetchChartUri);

	const fetchDashboardDataUri = apiUri + 'dataPoint/dashboardData';
	const dashboardData = yield call(doFetch, fetchDashboardDataUri);

	yield put({ type: FETCH_CHARTS_SUCCESS, payload: { chartHistoricalData, dashboardData } });
}

function* fetchChartsCall() {
	yield takeEvery(FETCH_CHARTS, fetchCharts);
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

	const escrowContracts = [
		snxjs.SynthetixEscrow.contract.address,
		snxjs.RewardEscrow.contract.address,
	];

	const [totalIssuedSynths, issuanceRatio, usdToSnxPrice] = [
		unformattedTotalIssuedSynths,
		unformattedIssuanceRatio,
		unformattedUsdToSnxPrice,
	].map(val => Number(snxjs.utils.formatEther(val)));

	let snxTotal = 0;
	let snxLocked = 0;
	let stakersTotalDebt = 0;
	let stakersTotalCollateral = 0;

	// remove escrow accounts from list of holders and loop over remaining holders
	holders
		.filter(({ address }) => escrowContracts.indexOf(address.toLowerCase()) === -1)
		.forEach(({ collateral, debtEntryAtIndex, initialDebtOwnership }) => {
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
function* fetchExchangeOpenInterest() {
	const fetchUri = apiUri + 'exchange/openInterest';
	const data = yield call(doFetch, fetchUri);
	yield put({ type: FETCH_OPEN_INTEREST_SUCCESS, payload: { data } });
}

function* fetchExchangeTradingVolume() {
	const ts = Math.floor(Date.now() / 1e3);
	const oneDayAgo = ts - 3600 * 24;

	const exchanges = yield call(snxData.exchanges.since, { timestampInSecs: oneDayAgo });
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

function* fetchExchangeTicker() {
	const fetchUri = apiUri + 'exchange/ticker/seth-susd';
	const data = yield call(doFetch, fetchUri);
	yield put({ type: FETCH_EXCHANGE_TICKER_SUCCESS, payload: { data } });
}

function* fetchUniswapPool() {
	const fetchUri = apiUri + 'exchange/uniswap/seth';
	const data = yield call(doFetch, fetchUri);
	yield put({ type: FETCH_UNISWAP_POOL_SUCCESS, payload: { data } });
}

// MARKETS
function* fetchCurrency(action) {
	try {
		const data = yield call(doFetch, action.url);
		yield put(action.success(data));
	} catch (e) {
		yield put(action.error(e.body));
	}
}

function* fetchHAVCurrencyCall() {
	yield takeEvery(FETCH_HAV_CURRENCY, fetchCurrency);
}

function* fetchNUSDCurrencyCall() {
	yield takeEvery(FETCH_NUSD_CURRENCY, fetchCurrency);
}

function* fetchCoinmarketcapHAVCall() {
	yield takeEvery(FETCH_COINMARKETCAP_HAV, fetchCurrency);
}

function* fetchCoinmarketcapNUSDCall() {
	yield takeEvery(FETCH_COINMARKETCAP_NUSD, fetchCurrency);
}

function* fetchOpenInterest() {
	yield takeEvery(FETCH_OPEN_INTEREST, fetchExchangeOpenInterest);
}

function* fetchTradingVolume() {
	yield takeEvery(FETCH_TRADING_VOLUME, fetchExchangeTradingVolume);
}

function* fetchUniswapPoolCall() {
	yield takeEvery(FETCH_UNISWAP_POOL, fetchUniswapPool);
}

function* fetchExchangeTickerCall() {
	yield takeEvery(FETCH_EXCHANGE_TICKER, fetchExchangeTicker);
}

function* fetchNetworkData() {
	yield takeLatest(FETCH_NETWORK_DATA, fetchNetworkDataCall);
}

const rootSaga = function*() {
	yield all([
		fetchChartsCall(),
		fetchHAVCurrencyCall(),
		fetchNUSDCurrencyCall(),
		fetchCoinmarketcapHAVCall(),
		fetchCoinmarketcapNUSDCall(),
		fetchOpenInterest(),
		fetchTradingVolume(),
		fetchExchangeTickerCall(),
		fetchUniswapPoolCall(),
		fetchNetworkData(),
	]);
};

export default rootSaga;
