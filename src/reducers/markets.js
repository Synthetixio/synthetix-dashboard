import {
	FETCH_HAV_CURRENCY_SUCCESS,
	FETCH_HAV_CURRENCY_ERROR,
	FETCH_NUSD_CURRENCY_SUCCESS,
	FETCH_NUSD_CURRENCY_ERROR,
} from '../actions/actionTypes';

const initialState = {
	snx: {},
	susd: {},
	coinSNX: [],
	coinSUSD: [],
	errors: {},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_HAV_CURRENCY_SUCCESS:
			return {
				...state,
				snx: action.data.body.data.SNX,
			};
		case FETCH_HAV_CURRENCY_ERROR:
			return {
				...state,
				errors: action.error,
			};
		/////////////////////////////////////////
		case FETCH_NUSD_CURRENCY_SUCCESS:
			return {
				...state,
				susd: action.data.body.data.SUSD,
			};
		case FETCH_NUSD_CURRENCY_ERROR:
			return {
				...state,
				errors: action.error,
			};

		default:
			return state;
	}
};
