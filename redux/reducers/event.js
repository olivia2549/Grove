/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/event.js
 * Event reducer; stores state about an event
 */

import {
    EVENT_NAME_STATE_CHANGE,
    EVENT_DESCRIPTION_STATE_CHANGE,
    EVENT_TAGS_STATE_CHANGE,
    EVENT_START_TIME_STATE_CHANGE,
    EVENT_START_DATE_STATE_CHANGE,
} from "../constants";

const initialState = {
    ID: "",
    name: "",
    nameLowercase: "",
    description: "",
    tags: [],
    startDateTime: new Date(),
    location: "",
    attendees: []
}

/**
 * eventReducer
 *
 * @param state - null by default
 * @param action - reducer needs to take in an action so it knows what to execute
 */
export const eventReducer = (state = initialState, action) => {
    // Changes the state (aka the event)
    switch (action.type) {
        case 'EVENT_NAME_STATE_CHANGE':
            return {
                ...state,
                name: action.name,
                nameLowercase: action.name.toLowerCase(),
            }
        case 'EVENT_DESCRIPTION_STATE_CHANGE':
            return {
                ...state,
                description: action.description
            }
        case 'EVENT_TAGS_STATE_CHANGE':
            return {
                ...state,
                tags: action.tags
            }
        case 'EVENT_LOCATION_STATE_CHANGE':
            return {
                ...state,
                location: action.location
            }
        case 'EVENT_START_TIME_STATE_CHANGE':
            var newDate = new Date(
                state.startDateTime.getFullYear(),
                state.startDateTime.getMonth(),
                state.startDateTime.getDate(),
                action.startTime.getHours(),
                action.startTime.getMinutes(),
                action.startTime.getSeconds(),
                action.startTime.getMilliseconds()
            );

            return {
                ...state,
                startDateTime: newDate,
            }
        case 'EVENT_START_DATE_STATE_CHANGE':
            newDate = new Date(
                action.startDate.getFullYear(),
                action.startDate.getMonth(),
                action.startDate.getDate(),
                state.startDateTime.getHours(),
                state.startDateTime.getMinutes(),
                state.startDateTime.getSeconds(),
                state.startDateTime.getMilliseconds(),
            );    

            return {
                ...state,
                startDateTime: newDate,
            }
        default:
            return state;
    }
}

export default eventReducer;
