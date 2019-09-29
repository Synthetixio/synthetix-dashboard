import {
	FETCH_OPEN_INTEREST,
	FETCH_TRADING_VOLUME,
	FETCH_EXCHANGE_TICKER,
	FETCH_UNISWAP_POOL,
} from './actionTypes.js';

export const fetchOpenInterest = () => {
	return { type: FETCH_OPEN_INTEREST };
};

export const fetchTradingVolume = () => {
	return { type: FETCH_TRADING_VOLUME };
};

export const fetchExchangeTicker = () => {
	return { type: FETCH_EXCHANGE_TICKER };
};

export const fetchUniswapPool = () => {
	return { type: FETCH_UNISWAP_POOL };
};
