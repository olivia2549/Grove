/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/event.js
 * Event reducer; stores state about an event
 */
import { EVENT_NAME_STATE_CHANGE, EVENT_DESCRIPTION_STATE_CHANGE, 
    EVENT_TAGS_STATE_CHANGE, EVENT_ENDTIME_STATE_CHANGE, 
    EVENT_STARTTIME_STATE_CHANGE } from "../constants";

const initialState = {
    eventName: "",
    eventDescription: "",
    eventTags: [],
    eventStartTime: new Date(),
    eventEndTime: new Date(),
    eventLocation: "",
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
        case 'EVENT_TAGS_STATE_CHANGE':
            return {
                ...state,
                eventTags: action.eventTags
            }
        case 'EVENT_LOCATION_STATE_CHANGE':
            return {
                ...state,
                eventLocation: action.eventLocation
            }
        case 'EVENT_STARTTIME_STATE_CHANGE':
            return {
                ...state,
                eventStartTime: action.eventStartTime
            }
        case 'EVENT_ENDTIME_STATE_CHANGE':
            return {
                ...state,
                eventEndTime: action.eventEndTime
            }
        default:
            return state;
    }
}

export default eventReducer;
