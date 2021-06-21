/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Actions/index.js
 * Defines redux actions
 */

import {USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE} from "../constants/index";
import firebase from "firebase";

// fetch user
// save user
// save posts

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
 * fetchUser
 *
 * Grabs user information from firebase
 */
export const fetchUserPosts = () => {
    return ((dispatch) => {  // makes a call to the database
        firebase.firestore()
            .collection("posts")
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
                console.log(postsArr);
                dispatch({type: USER_POSTS_STATE_CHANGE, posts: postsArr});
            })
            .catch((error) => {console.log(error)})
    })
}
