/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Profile.js
 * Create/edit user profile
 */

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Button,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import firebase from "firebase";
import {
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
} from "../../redux/constants";
import { clearData } from "../../redux/actions";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Profile = (props) => {
    const [userEvents, setUserEvents] = useState([]);
    const [user, setUser] = useState(null);
    const currentUser = useSelector((state) => state.currentUser);
    const currentUserEvents = useSelector(state => state.currentUser.events);
    const dispatch = useDispatch();

    const signOut = () => {
        firebase.auth().signOut();
        dispatch(clearData());
    };

    // Load user, and if different than current user, fetch from database
    useEffect(() => {
        // If the uid to display is the current user, our job is easy
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserEvents(currentUserEvents);
        }
        // Otherwise, we need to grab a different user and their events from firebase
        else {
            // This is essentially 'fetchUser' from actions/index.js but doesn't change state of application
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)    // This time, grab the uid from what was passed in as a props param
                .get()
                .then((snapshot) => {
                    // if the user exists, change the user state
                    if (snapshot.exists) {
                        // Set user to display onscreen
                        setUser(snapshot.data());
                    }
                    else {
                        console.log("User does not exist.")
                    }
                })
                .catch((error) => {console.log(error)})

            // This is essentially 'fetchUserEvents' from actions/index.js but doesn't change state of application
            firebase.firestore()
                .collection("events")
                .doc(props.route.params.uid)    // This time, grab the uid from what was passed in as a props param
                .collection("userEvents")    // fetch everything in the collection
                .orderBy("creation", "asc") // ascending order by creation date
                .get()
                .then((snapshot) => {
                    // Iterate through everything in the snapshot and build a events array
                    let eventsArr = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }  // the object to place in the events array
                    });
                    setUserEvents(eventsArr);
                })
                .catch((error) => {console.log(error)})
        }
    }, [props.route.params.uid]);    // Only calls useEffect when uid changes (makes app faster)

  if (user === null) {
    return <View />;
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>{user.name}</Text>
      </View>

      <View style={styles.profileBackground}>
        <Image
          source={require("../../assets/profileicon.jpg")}
          style={styles.profilePic}
        />
      </View>

      <View style={styles.infoView}>
        <View style={styles.containerInfo}>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => console.log("Tryna add some good friends")}
          style={styles.addFriend}
        >
          <Text style={styles.addFriendText}>Add Friend</Text>
        </TouchableOpacity>
        <View style={styles.lockContainer}>
          <Image
            source={require("../../assets/lock_outline.png")}
            style={styles.lockIcon}
          />
          <Text style={styles.lockIconText}>
            Follow this account to see their events
          </Text>
        </View>
        <View style={styles.containerGallery}>
          <FlatList
            numColumns={3}
            horizontal={false}
            data={userPosts}
            renderItem={({ item }) => (
              <View style={styles.containerImage}>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </View>
            )}
          />
        </View>
      </View>

      {/* <Button style={{}} title="Sign Out" onPress={signOut}/> */}

      {/* <View style={{padding: 15}}> */}
      <TouchableOpacity onPress={signOut} style={styles.signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },

  // view
  infoView: {
    flex: Platform.OS === "ios" ? 5 : 6,
    backgroundColor: "white",
  },

  // user's name
  userNameContainer: {
    flex: 2,
    backgroundColor: "#5DB075",
    justifyContent: "center",
  },
  userNameText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: windowWidth * 0.084,
    color: "white",
    marginBottom: Platform.OS === "ios" ? 0 : 30,
  },

  // profile pic
  profileBackground: {
    width: 110,
    height: 110,
    borderRadius: 200,
    justifyContent: "center",
    marginLeft: 15,
    marginTop: -55,
    backgroundColor: "white",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 400 / 2,
    marginLeft: 5,
    marginBottom: 0,
  },

  // user info
  userEmail: {
    marginLeft: 20,
    fontSize: windowWidth * 0.045,
    fontWeight: "400",
  },

  // add friend
  addFriend: {
    flex: 1 / 7,
    marginHorizontal: windowWidth * 0.028,
    marginTop: 8,
    height: "7%",
    backgroundColor: "#5DB075",
    borderRadius: 10,
    justifyContent: "center",
  },
  addFriendText: {
    textAlign: "center",
    color: "white",
    fontSize: windowWidth * 0.04,
  },

  // locked
  lockContainer: {
    marginTop: 25,
    flexDirection: "row",
  },
  lockIcon: {
    justifyContent: "center",
    marginLeft: 20,
    width: windowWidth * 0.058,
    height: windowHeight * 0.037,
  },
  lockIconText: {
    color: "#666666",
    fontSize: windowWidth * 0.042,
    marginLeft: 10,
    marginTop: 2,
  },

  //sign out
  signOut: {
    flex: 1 / 4,
    marginHorizontal: 12,
    marginLeft: 18,
    marginBottom: 6,
    backgroundColor: "#5DB075",
    borderRadius: 20,
    justifyContent: "center",
  },
  signOutText: {
    textAlign: "center",
    color: "white",
    fontSize: windowWidth * 0.031,
  },
});

export default Profile;
