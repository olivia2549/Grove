/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/index.js
 * The main reducers file; combines all the reducers to one store state
 */

import { combineReducers } from "redux";
import { userReducer } from "./user"

/**
 * allReducers
 *
 * Combines all the files in the reducers folder
 */
const allReducers = combineReducers({
    currentUser: userReducer,
});

export default allReducers;
