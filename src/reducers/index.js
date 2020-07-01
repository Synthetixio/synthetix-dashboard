import { combineReducers } from 'redux';
import charts from './charts';
import theme from './theme';
import markets from './markets';
import exchange from './exchange';
import network from './network';
import binaryOptions from './binaryOptions';

export default combineReducers({
	charts,
	theme,
	markets,
	exchange,
	network,
	binaryOptions,
});
