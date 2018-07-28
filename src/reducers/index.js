import { combineReducers } from "redux";
import charts from "./charts";
import theme from "./theme";

export default combineReducers({
  charts,
  theme
});
