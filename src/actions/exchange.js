import { FETCH_OPEN_INTEREST, FETCH_TRADING_VOLUME } from './actionTypes.js';

export const fetchOpenInterest = () => {
  return { type: FETCH_OPEN_INTEREST };
};

export const fetchTradingVolume = () => {
  return { type: FETCH_TRADING_VOLUME };
};
