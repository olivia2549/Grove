import { combineReducers } from "redux";    // this combines the files in the reducers folder
import { userReducer } from "./user"

// Combines all our reducers to one store state
const allReducers = combineReducers({
    currentUser: userReducer,
});

export default allReducers;
