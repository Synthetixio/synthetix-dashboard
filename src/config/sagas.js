import { takeEvery, call, put, all } from "redux-saga/effects";

import {
    FETCH_CHARTS,
    FETCH_CHARTS_SUCCESS,
    FETCH_HAV_CURRENCY,
    FETCH_NUSD_CURRENCY,
    FETCH_COINMARKETCAP_HAV,
    FETCH_COINMARKETCAP_NUSD
} from "../actions/actionTypes";

import { doFetch } from "./api";

let apiUri = process.env.API_URL || "https://api.havven.io/api/";


//CHARTS
function* fetchCharts() {
  const fetchUri = apiUri + "dataPoint/chartData";
  const data = yield call(doFetch, fetchUri);
  yield put({ type: FETCH_CHARTS_SUCCESS, payload: { data } });
}

function* fetchChartsCall() {
  yield takeEvery(FETCH_CHARTS, fetchCharts);
}

// MARKETS
function* fetchCurrency(action) {
  try {
    const data = yield call(doFetch, action.url);
    yield put( action.success( data ) );
  } catch ( e ) {
    yield put( action.error( e.body ) )
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

const rootSaga = function*() {
  yield all([
    fetchChartsCall(),
    fetchHAVCurrencyCall(),
    fetchNUSDCurrencyCall(),
    fetchCoinmarketcapHAVCall(),
    fetchCoinmarketcapNUSDCall()
  ]);
};

export default rootSaga;
