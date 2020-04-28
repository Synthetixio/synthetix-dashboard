import { FETCH_NETWORK_DATA_SUCCESS, FETCH_NETWORK_FEES_SUCCESS } from '../actions/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_NETWORK_DATA_SUCCESS:
			const {
				percentLocked,
				activeCollateralizationRatio,
				totalIssuedSynths,
			} = action.payload.data.body;
			return {
				...state,
				percentLocked,
				activeCollateralizationRatio,
				totalIssuedSynths,
			};
		case FETCH_NETWORK_FEES_SUCCESS:
			const { totalFeesAvailable } = action.payload.data.body;
			return {
				...state,
				totalFeesAvailable,
			};
		default:
			return state;
	}
};
