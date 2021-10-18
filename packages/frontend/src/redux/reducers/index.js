import { combineReducers } from "redux";

import appReducer from "./appReducer";
import themeReducer from "./themeReducer";
import authReducer from "./authReducer";
import crudReducer from "./crudReducer";

export const rootReducer = combineReducers({
  appReducer,
  themeReducer,
  authReducer,
  crudReducer,
});
