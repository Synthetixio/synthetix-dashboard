import { FETCH_BINARY_OPTIONS_TRANSACTIONS, FETCH_BINARY_OPTIONS_MARKETS } from './actionTypes';

export const fetchBinaryOptionsMarkets = () => ({
	type: FETCH_BINARY_OPTIONS_MARKETS,
});

export const fetchBinaryOptionsTransactions = () => ({
	type: FETCH_BINARY_OPTIONS_TRANSACTIONS,
});
