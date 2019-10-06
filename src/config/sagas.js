import { takeEvery, call, put, all } from 'redux-saga/effects';

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
} from '../actions/actionTypes';

import { doFetch } from './api';

import { SynthetixJs } from 'synthetix-js';

const {
	utils: { formatEther },
} = SynthetixJs;

const apiUri = process.env.API_URL || 'https://api.synthetix.io/api/';

//CHARTS
function* fetchCharts() {
	const fetchUri = apiUri + 'dataPoint/chartData';
	const data = yield call(doFetch, fetchUri);
	yield put({ type: FETCH_CHARTS_SUCCESS, payload: { data } });
}

function* fetchChartsCall() {
	yield takeEvery(FETCH_CHARTS, fetchCharts);
}

// EXCHANGE
function* fetchExchangeOpenInterest() {
	const fetchUri = apiUri + 'exchange/openInterest';
	const data = yield call(doFetch, fetchUri);
	yield put({ type: FETCH_OPEN_INTEREST_SUCCESS, payload: { data } });
}

const graphAPI = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix-exchanges';
const PAGE_SIZE = 100;

function* pageResults({ queryCreator, field }) {
	function* runner({ skip }) {
		const response = yield doFetch(graphAPI, 'POST', queryCreator({ skip }), undefined, false);

		let { [field]: results } = response.body.data;

		if (results.length >= PAGE_SIZE) {
			results = results.concat(yield runner({ skip: skip + PAGE_SIZE }));
		}

		return results;
	}

	return yield runner({ skip: 0 });
}

function* fetchExchangeTradingVolume() {
	const ts = Math.floor(Date.now() / 1e3);
	const oneDayAgo = ts - 3600 * 24;

	const synthExchangesIn24Hrs = yield call(pageResults, {
		field: 'synthExchanges',
		queryCreator: ({ skip }) =>
			`{"query":"{synthExchanges(first:${PAGE_SIZE}, skip:${skip}, orderBy:timestamp, orderDirection:desc, where:{timestamp_gt: ${oneDayAgo}}){id,from,gasPrice,fromAmount,fromCurrencyKey,toCurrencyKey,fromAmountInUSD,block,timestamp,toAddress}}","variables":null}`,
	});

	const last24Hours = synthExchangesIn24Hrs.reduce(
		(memo, { fromAmountInUSD }) => memo + Number(formatEther(fromAmountInUSD)),
		0
	);

	const [{ totalFeesGeneratedInUSD, exchangeUSDTally }] = yield call(pageResults, {
		field: 'totals',
		queryCreator: () =>
			`{"query": "{totals(first: 1) {exchangers,exchangeUSDTally,totalFeesGeneratedInUSD}}", "variables": null}`,
	});

	const data = {
		body: {
			totalFeesGenerated: Number(formatEther(totalFeesGeneratedInUSD)),
			volume: {
				last24Hours,
				total: Number(formatEther(exchangeUSDTally)),
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
	]);
};

export default rootSaga;
