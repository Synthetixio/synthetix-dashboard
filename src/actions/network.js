import { FETCH_NETWORK_DATA, FETCH_NETWORK_FEES } from './actionTypes.js';

export const fetchNetworkData = snxjs => {
	return { type: FETCH_NETWORK_DATA, payload: { snxjs } };
};
export const fetchNetworkFees = snxjs => {
	return { type: FETCH_NETWORK_FEES, payload: { snxjs } };
};
