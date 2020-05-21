import { FETCH_OPEN_INTEREST, FETCH_TRADING_VOLUME, FETCH_UNISWAP_DATA } from './actionTypes';

export const fetchOpenInterest = snxjs => {
	return { type: FETCH_OPEN_INTEREST, payload: { snxjs } };
};

export const fetchTradingVolume = () => {
	return { type: FETCH_TRADING_VOLUME };
};

export const fetchUniswapData = snxjs => {
	return { type: FETCH_UNISWAP_DATA, payload: { snxjs } };
};
