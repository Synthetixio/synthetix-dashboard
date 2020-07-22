import {
	FETCH_SNX_CURRENCY_SUCCESS,
	FETCH_SNX_CURRENCY_PRICE_SUCCESS,
	FETCH_SETH_CURRENCY_PRICE_SUCCESS,
	FETCH_SUSD_CURRENCY_PRICE_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
	snx: {},
	susd: {},
	seth: {},
	coinSNX: [],
	coinSUSD: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_SNX_CURRENCY_SUCCESS:
			return {
				...state,
				snx: action.data.body.data.SNX,
			};
		case FETCH_SNX_CURRENCY_PRICE_SUCCESS:
			const { snxPrice, snxTotalSupply } = action.payload.data;
			return {
				...state,
				snx: {
					...state.snx,
					snxPrice,
					snxTotalSupply,
				},
			};
		case FETCH_SUSD_CURRENCY_PRICE_SUCCESS:
			const { susdPrice } = action.payload.data;
			return {
				...state,
				susd: {
					...state.susd,
					susdPrice,
				},
			};
		case FETCH_SETH_CURRENCY_PRICE_SUCCESS:
			const { sethPrice } = action.payload.data;
			return {
				...state,
				seth: {
					...state.seth,
					sethPrice,
				},
			};

		default:
			return state;
	}
};
