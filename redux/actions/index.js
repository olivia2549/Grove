import { USER_STATE_CHANGE } from "../constants/index";
import firebase from "firebase";

// fetch user
// save user
// save posts

export const fetchUser = () => {
    return ((dispatch) => {  // makes a call to the database
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                console.log("Successful")       // TODO: THIS IS ONLY FOR TESTING PURPOSES
                // if the user exists, change the user state
                if (snapshot.exists) {
                    console.log(snapshot.data())
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                }
                else {
                    console.log("User does not exist.")
                }
            })
            .catch((error) => {console.log(error)})
    })
}
