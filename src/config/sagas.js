import { takeEvery, call, put, all } from "redux-saga/effects";

import { FETCH_CHARTS, FETCH_CHARTS_SUCCESS } from "../actions/charts";

import { doFetch } from "./api";

let apiUri = process.env.API_URL || "https://api.havven.io/api/";

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
