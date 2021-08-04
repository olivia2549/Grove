/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Actions/index.js
 * Defines redux actions
 */

import {
    CLEAR_USER_DATA,
    EVENT_NAME_STATE_CHANGE,
    EVENT_DESCRIPTION_STATE_CHANGE,
    EVENT_START_TIME_STATE_CHANGE,
    EVENT_END_TIME_STATE_CHANGE,
    EVENT_START_DATE_STATE_CHANGE,
    EVENT_END_DATE_STATE_CHANGE,
    EVENT_LOCATION_STATE_CHANGE,
    EVENT_TAGS_STATE_CHANGE,
    USER_STATE_CHANGE,
    USER_PROFILE_STATE_CHANGE,
    USER_FRIENDS_STATE_CHANGE,
    USER_INCOMING_REQUESTS_STATE_CHANGE,
    USER_OUTGOING_REQUESTS_STATE_CHANGE,
} from "../constants/index";

import firebase from "firebase";


// Deletes user from redux store when they sign out
export const clearUserData = () => {
    return ((dispatch) => {
        dispatch({type: CLEAR_USER_DATA})
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

export const fetchUserIncomingRequests = () => {
    return ((dispatch) => {
        firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("incomingRequests")
            .onSnapshot(snapshot => {
                let incomingRequests = snapshot.docs.map(doc => {
                    return doc.id;
                })
                console.log("incoming requests state change for ", firebase.auth().currentUser.uid);
                dispatch({type: USER_INCOMING_REQUESTS_STATE_CHANGE, incomingRequests});
            })
    })
}

export const fetchUserOutgoingRequests = () => {
    return ((dispatch) => {
        firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("outgoingRequests")
            .onSnapshot(snapshot => {
                let outgoingRequests = snapshot.docs.map(doc => {
                    return doc.id;
                })
                console.log("outgoing requests state change for ", firebase.auth().currentUser.uid);
                dispatch({type: USER_OUTGOING_REQUESTS_STATE_CHANGE, outgoingRequests});
            })
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

export const changeProfile = (profile) => {
    console.log(profile);
    firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({
            name: profile.name,
            year: profile.year,
            major: profile.major,
            bio: profile.bio,
        });
    return ((dispatch) => {
        dispatch({type: USER_PROFILE_STATE_CHANGE, profile: profile});
    })
}
