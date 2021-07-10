/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/index.js
 * The main reducers file; combines all the reducers to one store state
 */

import { combineReducers } from "redux";
import { userReducer } from "./user"
import { eventReducer } from "./event";

/**
 * allReducers
 *
 * Combines all the files in the reducers folder
 */
const allReducers = combineReducers({
    currentUser: userReducer,
    event: eventReducer
});

export default allReducers;
