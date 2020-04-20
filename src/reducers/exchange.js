import {
	FETCH_OPEN_INTEREST_SUCCESS,
	FETCH_TRADING_VOLUME_SUCCESS,
	FETCH_EXCHANGE_TICKER_SUCCESS,
	FETCH_UNISWAP_POOL_SUCCESS,
} from '../actions/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_OPEN_INTEREST_SUCCESS:
			const { openInterest, distribution } = action.payload.data.body;
			return {
				...state,
				openInterest,
				distribution,
			};
		case FETCH_TRADING_VOLUME_SUCCESS:
			const { volume, totalFeesGenerated } = action.payload.data.body;
			return {
				...state,
				volume,
				totalFeesGenerated,
			};
		case FETCH_EXCHANGE_TICKER_SUCCESS:
			const {
				symbol,
				rate,
				bid,
				ask,
				volume24hFrom,
				volume24hTo,
				low24hRate,
				high24hRate,
			} = action.payload.data.body;
			return {
				...state,
				symbol,
				rate,
				bid,
				ask,
				volume24hFrom,
				volume24hTo,
				low24hRate,
				high24hRate,
			};
		case FETCH_UNISWAP_POOL_SUCCESS:
			const { eth, synth } = action.payload.data.body;
			return {
				...state,
				...{ uniswap: { eth, synth } },
			};
		default:
			return state;
	}
};
