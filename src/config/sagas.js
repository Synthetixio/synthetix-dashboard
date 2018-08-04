import { takeEvery, call, put, all } from "redux-saga/effects";

import { FETCH_CHARTS, FETCH_CHARTS_SUCCESS } from "../actions/charts";

import { doFetch } from "./api";

const API_URI = "https://api.havven.io/api/";
const STAGING_API_URI = "https://staging-api.havven.io/api/";

let useStagingApi = false; //false;
let apiUri = useStagingApi ? STAGING_API_URI : API_URI;

let headers = new Headers();
headers.append("Accept", "application/json");
let init = {
  method: "GET",
  headers
};

function* fetchCharts() {
  const fetchUri = apiUri + "dataPoint/chartData";
  const data = yield call(doFetch, fetchUri);
  yield put({ type: FETCH_CHARTS_SUCCESS, payload: { data } });
}

function* fetchChartsCall() {
  yield takeEvery(FETCH_CHARTS, fetchCharts);
}

const rootSaga = function*() {
  yield all([fetchChartsCall()]);
};

export default rootSaga;
