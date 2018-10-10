import {
  FETCH_HAV_CURRENCY_SUCCESS,
  FETCH_HAV_CURRENCY_ERROR,
  FETCH_NUSD_CURRENCY_SUCCESS,
  FETCH_NUSD_CURRENCY_ERROR,
  FETCH_COINMARKETCAP_HAV_SUCCESS,
  FETCH_COINMARKETCAP_HAV_ERROR,
  FETCH_COINMARKETCAP_NUSD_SUCCESS,
  FETCH_COINMARKETCAP_NUSD_ERROR
} from '../actions/actionTypes';

const initialState = {
  hav: {},
  nusd: {},
  coinHAV: [],
  coinNUSD: [],
  errors: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HAV_CURRENCY_SUCCESS:
      return {
        ...state,
        hav: action.data.body.data
      }
    case FETCH_HAV_CURRENCY_ERROR:
      return {
        ...state,
        errors: action.error
      }
/////////////////////////////////////////
    case FETCH_NUSD_CURRENCY_SUCCESS:
      return {
        ...state,
        nusd: action.data.body.data
      }
    case FETCH_NUSD_CURRENCY_ERROR:
      return {
        ...state,
        errors: action.error
      }
/////////////////////////////////////////
    case FETCH_COINMARKETCAP_HAV_SUCCESS:
      return {
        ...state,
        coinHAV: action.data.body
      }
    case FETCH_COINMARKETCAP_HAV_ERROR:
      return {
        ...state,
        errors: action.error
      }
/////////////////////////////////////////
    case FETCH_COINMARKETCAP_NUSD_SUCCESS:
      return {
        ...state,
        coinHAV: action.data.body
      }
    case FETCH_COINMARKETCAP_NUSD_ERROR:
      return {
        ...state,
        errors: action.error
      }

    default:
      return state;
  }
};



