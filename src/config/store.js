import { applyMiddleware, createStore, compose } from "redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import persistState from "redux-localstorage";

import reducer from "../reducers";
import rootSaga from "./sagas";

const persistEnhancer = persistState(["theme"], { key: "havven-dashboard" });
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];
if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

const store = createStore(
  reducer,
  compose(applyMiddleware(...middleware), persistEnhancer)
);

if (process.env.NODE_ENV === "development") {
  window.store = store;
}

sagaMiddleware.run(rootSaga);

export { store };
