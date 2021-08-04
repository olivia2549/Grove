/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/user.js
 * User reducer; stores state about the user
 */

import {
    USER_STATE_CHANGE,
    USER_PROFILE_STATE_CHANGE,
    USER_FRIENDS_STATE_CHANGE,
    USER_INCOMING_REQUESTS_STATE_CHANGE,
    USER_OUTGOING_REQUESTS_STATE_CHANGE,
    CLEAR_USER_DATA,
} from "../constants";

const initialState = {
    ID: null,
    name: "",
    nameLowercase: "",
    email: "",
    year: -1,
    major: "",
    bio: "",
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    eventsPosted: [],
    eventsAttending: [],
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
                ID: action.ID,
                name: action.name,
                nameLowercase: action.name.toLowerCase(),
                email: action.email,
                year: action.year,
                major: action.major,
                bio: action.bio,
                eventsPosted: action.eventsPosted,
                eventsAttending: action.eventsAttending,
            }
        case 'USER_PROFILE_STATE_CHANGE':
            return {
                ...state,
                name: action.profile.name,
                year: action.profile.year,
                major: action.profile.major,
                bio: action.profile.bio,
            }
        case 'USER_FRIENDS_STATE_CHANGE':
            return {
                ...state,
                friends: action.friends,
            }
        case 'USER_INCOMING_REQUESTS_STATE_CHANGE':
            return {
                ...state,
                incomingRequests: action.incomingRequests,
            }
        case 'USER_OUTGOING_REQUESTS_STATE_CHANGE':
            return {
                ...state,
                outgoingRequests: action.outgoingRequests,
            }
        case 'CLEAR_USER_DATA':
            return initialState;
        default:
            return state;
    }
}

export default userReducer;
