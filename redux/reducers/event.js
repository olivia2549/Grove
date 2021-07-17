/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Reducers/event.js
 * Event reducer; stores state about an event
 */
import { EVENT_NAME_STATE_CHANGE, EVENT_DESCRIPTION_STATE_CHANGE, EVENT_TAGS_STATE_CHANGE, 
    EVENT_ENDTIME_STATE_CHANGE, EVENT_STARTTIME_STATE_CHANGE, 
    EVENT_STARTDATE_STATE_CHANGE, EVENT_ENDDATE_STATE_CHANGE } from "../constants";

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
            var newDate = new Date(
                state.eventStartTime.getFullYear(),
                state.eventStartTime.getMonth(),
                state.eventStartTime.getDate(),
                action.startTime.getHours(),
                action.startTime.getMinutes(),
                action.startTime.getSeconds(),
                action.startTime.getMilliseconds()
            );

            return {
                ...state,
                eventStartTime: newDate,
            }
        case 'EVENT_ENDTIME_STATE_CHANGE':
            newDate = new Date(
                state.eventEndTime.getFullYear(),
                state.eventEndTime.getMonth(),
                state.eventEndTime.getDate(),
                action.endTime.getHours(),
                action.endTime.getMinutes(),
                action.endTime.getSeconds(),
                action.endTime.getMilliseconds()
            );
            
            const startDate = state.eventEndTime.getDate();
            return {
                ...state,
                eventEndTime: newDate,
            }
        case 'EVENT_STARTDATE_STATE_CHANGE':
            newDate = new Date(
                action.startDate.getFullYear(),
                action.startDate.getMonth(),
                action.startDate.getDate(),
                state.eventStartTime.getHours(),
                state.eventStartTime.getMinutes(),
                state.eventStartTime.getSeconds(),
                state.eventStartTime.getMilliseconds(),
            );    

            return {
                ...state,
                eventStartTime: newDate,
            }
        case 'EVENT_ENDDATE_STATE_CHANGE':
            newDate = new Date(
                action.endDate.getFullYear(),
                action.endDate.getMonth(),
                action.endDate.getDate(),
                state.eventEndTime.getHours(),
                state.eventEndTime.getMinutes(),
                state.eventEndTime.getSeconds(),
                state.eventEndTime.getMilliseconds(),
            );    

            return {
                ...state,
                eventEndTime: newDate
            }
        default:
            return state;
    }
}

export default eventReducer;
