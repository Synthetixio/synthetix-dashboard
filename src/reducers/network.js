import {
	FETCH_NETWORK_DATA_SUCCESS,
	FETCH_NETWORK_FEES_SUCCESS,
	FETCH_NETWORK_DEPOT_SUCCESS,
} from '../actions/actionTypes';

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
			const {
				totalFeesAvailable,
				totalRewardsAvailable,
				unclaimedFees,
				unclaimedRewards,
			} = action.payload.data.body;
			return {
				...state,
				totalFeesAvailable,
				totalRewardsAvailable,
				unclaimedFees,
				unclaimedRewards,
			};
		case FETCH_NETWORK_DEPOT_SUCCESS:
			const { totalSellableDeposits } = action.payload.data.body;
			return {
				...state,
				totalSellableDeposits,
			};
		default:
			return state;
	}
};
