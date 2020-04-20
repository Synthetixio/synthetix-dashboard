import { SWITCH_THEME } from '../actions/actionTypes';

const initialState = {
	theme: 'dark',
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SWITCH_THEME:
			return {
				...state,
				theme: action.theme,
			};
		default:
			return state;
	}
};
