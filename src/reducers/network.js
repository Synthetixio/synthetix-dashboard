import { FETCH_NETWORK_DATA_SUCCESS } from '../actions/actionTypes';

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
		default:
			return state;
	}
};
