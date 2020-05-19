import { FETCH_NETWORK_DATA, FETCH_NETWORK_FEES, FETCH_NETWORK_DEPOT } from './actionTypes';

export const fetchNetworkData = snxjs => {
	return { type: FETCH_NETWORK_DATA, payload: { snxjs } };
};
export const fetchNetworkFees = snxjs => {
	return { type: FETCH_NETWORK_FEES, payload: { snxjs } };
};
export const fetchNetworkDepot = snxjs => {
	return { type: FETCH_NETWORK_DEPOT, payload: { snxjs } };
};
