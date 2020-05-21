import {
	FETCH_OPEN_INTEREST_SUCCESS,
	FETCH_TRADING_VOLUME_SUCCESS,
	FETCH_UNISWAP_DATA_SUCCESS,
} from '../actions/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_OPEN_INTEREST_SUCCESS:
			const { openInterest, shortsAndLongs } = action.payload.data.body;
			return {
				...state,
				openInterest,
				shortsAndLongs,
			};
		case FETCH_TRADING_VOLUME_SUCCESS:
			const { volume, totalFeesGenerated } = action.payload.data.body;
			return {
				...state,
				volume,
				totalFeesGenerated,
			};
		case FETCH_UNISWAP_DATA_SUCCESS:
			const { rate, eth, synth } = action.payload.data.body;
			return {
				...state,
				rate,
				uniswap: { eth, synth },
			};
		default:
			return state;
	}
};
