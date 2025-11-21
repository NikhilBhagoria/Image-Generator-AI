import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice.js";
import userReducer from "./slices/userSlice.js";
import { combineReducers } from "redux";
import { use } from "react";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});