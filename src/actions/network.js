import { FETCH_NETWORK_DATA } from './actionTypes.js';

export const fetchNetworkData = snxjs => {
	return { type: FETCH_NETWORK_DATA, payload: { snxjs } };
};
