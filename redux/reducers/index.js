import { combineReducers } from "redux";    // this combines the files in the reducers folder
import { user } from "./user"

const Reducers = combineReducers({
    userState: user
})

export default Reducers;
