import { SWITCH_THEME } from '../actions/actionTypes';

export const switchTheme = theme => {
	return {
		type: SWITCH_THEME,
		theme: theme,
	};
};
