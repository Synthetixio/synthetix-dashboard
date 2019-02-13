import {
  FETCH_HAV_CURRENCY,
  FETCH_HAV_CURRENCY_SUCCESS,
  FETCH_HAV_CURRENCY_ERROR,
  FETCH_NUSD_CURRENCY,
  FETCH_NUSD_CURRENCY_SUCCESS,
  FETCH_NUSD_CURRENCY_ERROR,
  FETCH_COINMARKETCAP_HAV,
  FETCH_COINMARKETCAP_HAV_SUCCESS,
  FETCH_COINMARKETCAP_HAV_ERROR,
  FETCH_COINMARKETCAP_NUSD,
  FETCH_COINMARKETCAP_NUSD_SUCCESS,
  FETCH_COINMARKETCAP_NUSD_ERROR,
} from './actionTypes.js';

export const fetchHAV = () => ({
  type: FETCH_HAV_CURRENCY,
  url: 'https://coinmarketcap-api.synthetix.io/public/prices?symbols=SNX',
  success: handleFetchHAVSuccess,
  error: handleFetchHAVError,
});

export const handleFetchHAVSuccess = data => {
  return {
    type: FETCH_HAV_CURRENCY_SUCCESS,
    data,
  };
};

export const handleFetchHAVError = error => {
  return {
    type: FETCH_HAV_CURRENCY_ERROR,
    error,
  };
};

/////////////////////////////////////////////
export const fetchNUSD = data => ({
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

/////////////////////////////////////////////
export const fetchCoinmarketcapHAV = data => ({
  type: FETCH_COINMARKETCAP_HAV,
  url: 'https://api.havven.io/api/markets/snx',
  success: handleFetchCoinmarketcapHAVSuccess,
  error: handleFetchCoinmarketcapHAVError,
});

export const handleFetchCoinmarketcapHAVSuccess = data => {
  return {
    type: FETCH_COINMARKETCAP_HAV_SUCCESS,
    data,
  };
};

export const handleFetchCoinmarketcapHAVError = error => {
  return {
    type: FETCH_COINMARKETCAP_HAV_ERROR,
    error,
  };
};

/////////////////////////////////////////////
export const fetchCoinmarketcapNUSD = data => ({
  type: FETCH_COINMARKETCAP_NUSD,
  url: 'https://api.havven.io/api/markets/susd',
  success: handleFetchCoinmarketcapNUSDSuccess,
  error: handleFetchCoinmarketcapNUSDError,
});

export const handleFetchCoinmarketcapNUSDSuccess = data => {
  return {
    type: FETCH_COINMARKETCAP_NUSD_SUCCESS,
    data,
  };
};

export const handleFetchCoinmarketcapNUSDError = error => {
  return {
    type: FETCH_COINMARKETCAP_NUSD_ERROR,
    error,
  };
};
