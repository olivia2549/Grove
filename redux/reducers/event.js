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
    EVENT_END_TIME_STATE_CHANGE,
    EVENT_START_TIME_STATE_CHANGE,
    EVENT_START_DATE_STATE_CHANGE,
    EVENT_END_DATE_STATE_CHANGE
} from "../constants";

const initialState = {
    name: "",
    description: "",
    tags: [],
    startDateTime: new Date(),
    endDateTime: new Date(),
    location: "",
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
        case 'EVENT_END_TIME_STATE_CHANGE':
            newDate = new Date(
                state.endDateTime.getFullYear(),
                state.endDateTime.getMonth(),
                state.endDateTime.getDate(),
                action.endTime.getHours(),
                action.endTime.getMinutes(),
                action.endTime.getSeconds(),
                action.endTime.getMilliseconds()
            );
            
            const startDate = state.endDateTime.getDate();
            return {
                ...state,
                endDateTime: newDate,
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
        case 'EVENT_END_DATE_STATE_CHANGE':
            newDate = new Date(
                action.endDate.getFullYear(),
                action.endDate.getMonth(),
                action.endDate.getDate(),
                state.endDateTime.getHours(),
                state.endDateTime.getMinutes(),
                state.endDateTime.getSeconds(),
                state.endDateTime.getMilliseconds(),
            );    

            return {
                ...state,
                endDateTime: newDate
            }
        default:
            return state;
    }
}

export default eventReducer;
