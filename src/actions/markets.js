import {
	FETCH_SNX_CURRENCY,
	FETCH_SNX_CURRENCY_PRICE,
	FETCH_SETH_CURRENCY_PRICE,
	FETCH_SUSD_CURRENCY_PRICE,
	FETCH_SNX_CURRENCY_SUCCESS,
} from './actionTypes';

export const fetchSnx = () => ({
	type: FETCH_SNX_CURRENCY,
	url: 'https://coinmarketcap-api.synthetix.io/public/prices?symbols=SNX',
	success: handleFetchSNXSuccess,
});

export const fetchSnxPrice = snxjs => ({
	type: FETCH_SNX_CURRENCY_PRICE,
	payload: { snxjs },
});

export const fetchSethPrice = snxjs => ({
	type: FETCH_SETH_CURRENCY_PRICE,
	payload: { snxjs },
});

export const handleFetchSNXSuccess = data => {
	return {
		type: FETCH_SNX_CURRENCY_SUCCESS,
		data,
	};
};

export const fetchSusdPrice = snxjs => ({
	type: FETCH_SUSD_CURRENCY_PRICE,
	payload: { snxjs },
});
