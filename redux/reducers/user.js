/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/user.js
 * User reducer; stores state about the user
 */

const initialState = {
    currentUser: null,
    events: []
}

/**
 * userReducer
 *
 * @param state - null by default
 * @param action - reducer needs to take in an action so it knows what to execute
 * @returns {{currentUser}|null}
 */
export const userReducer = (state = initialState, action) => {
    // Changes the state (aka the user) based on which action was called
    switch (action.type) {
        case 'USER_STATE_CHANGE':   // This one of the actions
            return {
                ...state,
                currentUser: action.currentUser
            }
        case 'USER_POSTS_STATE_CHANGE':
            return {
                ...state,
                events: action.events
            }
        case 'CLEAR_DATA':
            return initialState;
        default:
            return state;
    }
}

export default userReducer;
