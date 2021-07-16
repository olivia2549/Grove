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
    USER_POSTS_STATE_CHANGE,
    USER_STATE_CHANGE,
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


// EXTRA

/**
 * fetchUser - WE DONT USE THIS FORNOW
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
                    // dispatch the action 'USER_STATE_CHANGE' to the reducer
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                }
                else {
                    console.log("User does not exist.")
                }
            })
            .catch((error) => {console.log(error)})
    })
}

/**
 * fetchUser - WE DON'T USE THIS FOR NOW
 *
 * Grabs user information from firebase
 */
export const fetchUserEvents = () => {
    return ((dispatch) => {  // makes a call to the database
        firebase.firestore()
            .collection("events")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")    // fetch everything in the collection
            .orderBy("creation", "asc") // ascending order by creation date
            .get()
            .then((snapshot) => {
                // Iterate through everything in the snapshot and build a posts array
                let postsArr = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }  // the object to place in the posts array
                });
                dispatch({type: USER_POSTS_STATE_CHANGE, posts: postsArr});
            })
            .catch((error) => {console.log(error)})
    })
}
