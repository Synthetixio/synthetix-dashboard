import {
	FETCH_SNX_CURRENCY_SUCCESS,
	FETCH_SNX_CURRENCY_PRICE_SUCCESS,
	FETCH_SETH_CURRENCY_PRICE_SUCCESS,
	FETCH_NUSD_CURRENCY_SUCCESS,
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
		case FETCH_SETH_CURRENCY_PRICE_SUCCESS:
			const { sethPrice } = action.payload.data;
			return {
				...state,
				seth: {
					...state.seth,
					sethPrice,
				},
			};
		/////////////////////////////////////////
		case FETCH_NUSD_CURRENCY_SUCCESS:
			return {
				...state,
				susd: action.data.body.data.SUSD,
			};

		default:
			return state;
	}
};
