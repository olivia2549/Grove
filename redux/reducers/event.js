/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/event.js
 * Event reducer; stores state about an event
 */
import { EVENT_NAME_STATE_CHANGE, EVENT_DESCRIPTION_STATE_CHANGE } from "../constants";

const initialState = {
    eventName: "",
    eventDescription: ""
}

/**
 * userReducer
 *
 * @param state - null by default
 * @param action - reducer needs to take in an action so it knows what to execute
 * @returns {{currentUser}|null}
 */
export const eventReducer = (state = initialState, action) => {
    // Changes the state (aka the event)
    switch (action.type) {
        case 'EVENT_NAME_STATE_CHANGE':
            return {
                ...state,
                eventName: action.eventName,
            }
        case 'EVENT_DESCRIPTION_STATE_CHANGE':
            return {
                ...state,
                eventDescription: action.eventDescription
            }
        default:
            return state;
    }
}

export default eventReducer;
