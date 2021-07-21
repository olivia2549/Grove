/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Actions/index.js
 * Defines redux actions
 */

import {
    CLEAR_DATA,
    EVENT_NAME_STATE_CHANGE,
    EVENT_DESCRIPTION_STATE_CHANGE,
    EVENT_START_TIME_STATE_CHANGE,
    EVENT_END_TIME_STATE_CHANGE,
    EVENT_START_DATE_STATE_CHANGE,
    EVENT_END_DATE_STATE_CHANGE,
    EVENT_LOCATION_STATE_CHANGE,
    EVENT_TAGS_STATE_CHANGE,
    USER_STATE_CHANGE,
    USER_FRIENDS_STATE_CHANGE
} from "../constants/index";

import firebase from "firebase";

/**
 * clearData
 *
 * Deletes everything from redux store
 */
export const clearData = () => {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export const addEventName = (evName) => {
    return ((dispatch) => {
        dispatch({type: EVENT_NAME_STATE_CHANGE, name: evName});
    })
}

export const addEventDescription = (evDescription) => {
    return ((dispatch) => {
        dispatch({type: EVENT_DESCRIPTION_STATE_CHANGE, description: evDescription});
    })
}

export const addEventTags = (evTags) => {
    return ((dispatch) => {
        dispatch({type: EVENT_TAGS_STATE_CHANGE, tags: evTags});
    })
}

export const addStartDateTime = (evTime, dateOrTime) => {
    if (dateOrTime === "date") {
        return ((dispatch) => {
            dispatch({type: EVENT_START_DATE_STATE_CHANGE, startDate: evTime});
        })
    }
    else {
        return ((dispatch) => {
            dispatch({type: EVENT_START_TIME_STATE_CHANGE, startTime: evTime});
        })
    }
    
}

export const addEndDateTime = (evTime, dateOrTime) => {
    if (dateOrTime === "date") {
        return ((dispatch) => {
            dispatch({type: EVENT_END_DATE_STATE_CHANGE, endDate: evTime});
        })
    }
    else {
        return ((dispatch) => {
            dispatch({type: EVENT_END_TIME_STATE_CHANGE, endTime: evTime});
        })
    }
}

export const addEventLocation = (evLocation) => {
    return ((dispatch) => {
        dispatch({type: EVENT_LOCATION_STATE_CHANGE, location: evLocation});
    })
}

/**
 * fetchUser
 *
 * Grabs user information from firebase
 */
export const fetchUser = () => {
    return ((dispatch) => {  // makes a call to the database
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                // if the user exists, change the user state
                if (snapshot.exists) {
                    const user = snapshot.data();
                    // dispatch the action 'USER_STATE_CHANGE' to the reducer
                    dispatch({
                        type: USER_STATE_CHANGE,
                        ID: user.ID,
                        name: user.name,
                        email: user.email,
                        year: user.year,
                        major: user.major,
                        bio: user.bio,
                        friends: user.friends,
                        eventsPosted: user.eventsPosted,
                        eventsAttending: user.eventsAttending,
                    })
                }
                else {
                    console.log("User does not exist.")
                }
            })
            .catch((error) => {console.log(error)})
    })
}

// When the friends list changes, firebase recognizes this and updates redux
export const fetchUserFriends = () => {
    return ((dispatch) => {
        firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("friends")
            .onSnapshot(snapshot => {
                let friends = snapshot.docs.map(doc => {
                    return doc.id;
                })
                console.log("friends state change");
                dispatch({type: USER_FRIENDS_STATE_CHANGE, friends});
            })
    })
}
