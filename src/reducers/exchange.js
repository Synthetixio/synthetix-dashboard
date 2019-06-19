import {
  FETCH_OPEN_INTEREST_SUCCESS,
  FETCH_TRADING_VOLUME_SUCCESS,
} from '../actions/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_OPEN_INTEREST_SUCCESS:
      return {
        ...state,
        ...action.payload.data.body,
      };
    case FETCH_TRADING_VOLUME_SUCCESS:
      return {
        ...state,
        ...action.payload.data.body,
      };
    default:
      return state;
  }
};
