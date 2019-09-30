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
		return {
			...state,
			...action.payload.data.body,
		};
	case FETCH_TRADING_VOLUME_SUCCESS:
		return {
			...state,
			...action.payload.data.body,
		};
	case FETCH_EXCHANGE_TICKER_SUCCESS:
		return {
			...state,
			...action.payload.data.body,
		};
	case FETCH_UNISWAP_POOL_SUCCESS:
		return {
			...state,
			...{ uniswap: action.payload.data.body },
		};
	default:
		return state;
	}
};
