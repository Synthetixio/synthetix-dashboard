import {
	FETCH_BINARY_OPTIONS_MARKETS_SUCCESS,
	FETCH_BINARY_OPTIONS_TRANSACTIONS_SUCCESS,
} from '../actions/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_BINARY_OPTIONS_MARKETS_SUCCESS:
			const {
				numMarkets,
				totalPoolSizes,
				largestMarket,
				largestMarketPoolSize,
			} = action.payload.data.body;
			return {
				...state,
				numMarkets,
				totalPoolSizes,
				largestMarket,
				largestMarketPoolSize,
			};
		case FETCH_BINARY_OPTIONS_TRANSACTIONS_SUCCESS:
			const { numOptionsTransactions } = action.payload.data.body;
			return {
				...state,
				numOptionsTransactions,
			};
		default:
			return state;
	}
};
