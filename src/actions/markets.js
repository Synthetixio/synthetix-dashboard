import {
	FETCH_SNX_CURRENCY,
	FETCH_SNX_CURRENCY_SUCCESS,
	FETCH_SNX_CURRENCY_ERROR,
	FETCH_NUSD_CURRENCY,
	FETCH_NUSD_CURRENCY_SUCCESS,
	FETCH_NUSD_CURRENCY_ERROR,
} from './actionTypes';

export const fetchSNX = () => ({
	type: FETCH_SNX_CURRENCY,
	url: 'https://coinmarketcap-api.synthetix.io/public/prices?symbols=SNX',
	success: handleFetchSNXSuccess,
	error: handleFetchSNXError,
});

export const handleFetchSNXSuccess = data => {
	return {
		type: FETCH_SNX_CURRENCY_SUCCESS,
		data,
	};
};

export const handleFetchSNXError = error => {
	return {
		type: FETCH_SNX_CURRENCY_ERROR,
		error,
	};
};

/////////////////////////////////////////////
export const fetchNUSD = () => ({
	type: FETCH_NUSD_CURRENCY,
	url: 'https://coinmarketcap-api.synthetix.io/public/prices?symbols=sUSD',
	success: handleFetchNUSDSuccess,
	error: handleFetchNUSDError,
});

export const handleFetchNUSDSuccess = data => {
	return {
		type: FETCH_NUSD_CURRENCY_SUCCESS,
		data,
	};
};

export const handleFetchNUSDError = error => {
	return {
		type: FETCH_NUSD_CURRENCY_ERROR,
		error,
	};
};
