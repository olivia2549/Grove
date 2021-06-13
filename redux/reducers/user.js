/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/index.js
 * The main reducers file; combines all the reducers to one store state
 */


/**
 * userReducer
 *
 * @param state - null by default
 * @param action - reducer needs to take in an action so it knows what to execute
 * @returns {{currentUser}|null}
 */
export const userReducer = (state = null, action) => {
    // Changes the state (aka the user) based on which action was called
    switch (action.type) {
        case 'USER_STATE_CHANGE':   // This one of the actions
            return {
                ...state,
                name: action.currentUser.name,
                email: action.currentUser.email
            }
        default:
            return null;
    }
}

export default userReducer;
