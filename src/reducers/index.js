import { combineReducers } from "redux";
import charts from "./charts";
import theme from "./theme";
import markets from './markets'

export default combineReducers({
  charts,
  theme,
  markets,
});
