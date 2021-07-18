/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * ProfileFollowing.js
 * Profile page for someone you're following
 */

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

// firebase imports
import firebase from "firebase";
import {
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
} from "../../redux/constants";
import { clearData } from "../../redux/actions";
require("firebase/firestore");

// toggle button

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const ProfileFollowing = (props) => {
  const [userEvents, setUserEvents] = useState([]);
  const [user, setUser] = useState(null);
  const currentUser = useSelector((state) => state.currentUser);
  const currentUserEvents = useSelector((state) => state.currentUser.events);
  const dispatch = useDispatch();

  // for the switch
  const [upComingEvents, setUpComingEvents] = useState(true);
  const [eventsAttended, setEventsAttended] = useState(false);
  const [toggleSide, setToggleSide] = useState("flex-start");

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
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid) // This time, grab the uid from what was passed in as a props param
        .get()
        .then((snapshot) => {
          // if the user exists, change the user state
          if (snapshot.exists) {
            // Set user to display onscreen
            setUser(snapshot.data());
          } else {
            console.log("User does not exist.");
          }
        })
        .catch((error) => {
          console.log(error);
        });

      // This is essentially 'fetchUserEvents' from actions/index.js but doesn't change state of application
      firebase
        .firestore()
        .collection("events")
        .doc(props.route.params.uid) // This time, grab the uid from what was passed in as a props param
        .collection("userEvents") // fetch everything in the collection
        .orderBy("creation", "asc") // ascending order by creation date
        .get()
        .then((snapshot) => {
          // Iterate through everything in the snapshot and build a events array
          let eventsArr = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }; // the object to place in the events array
          });
          setUserEvents(eventsArr);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.route.params.uid]); // Only calls useEffect when uid changes (makes app faster)

  if (user === null) {
    return <View />;
  }

  const flipToggle = () => {
    console.log("here");
    if (upComingEvents) {
      setToggleSide("flex-end");
    } else if (eventsAttended) {
      setToggleSide("flex-start");
    }
    setUpComingEvents(!upComingEvents);
    setEventsAttended(!eventsAttended);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>{user.name}</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.profileBackground}>
        <Image
          source={require("../../assets/profileicon.jpg")}
          style={styles.profilePic}
        />
      </View>

      <View style={styles.infoView}>
        {/* User Info */}
        <View style={styles.containerInfo}>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Friends Button */}
        <TouchableOpacity style={styles.alreadyFriend}>
          <Text style={styles.alreadyFriendText}>Friends</Text>
        </TouchableOpacity>

        {/* Toggle Button */}
        <TouchableOpacity
          style={[styles.toggleContainer, { justifyContent: toggleSide }]}
          onPress={flipToggle}
          activeOpacity="0.77"
        >
          {/* upcoming events pressed */}
          {upComingEvents && (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={styles.upcomingEventsContainer}>
                <Text style={styles.toggleText}>Upcoming Events</Text>
              </View>
              <View style={styles.eventsAddedGreyTextContainer}>
                <Text style={styles.eventsAddedGreyText}>Events Attended</Text>
              </View>
            </View>
          )}

          {/* events attended pressed */}
          {eventsAttended && (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={styles.upcomingEventsGreyTextContainer}>
                <Text style={styles.upcomingEventsGreyText}>
                  Upcoming Events
                </Text>
              </View>
              <View style={styles.eventsAddedContainer}>
                <Text style={styles.toggleText}>Events Attended</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* List of events */}
        <View style={styles.containerGallery}>
          {/* <FlatList
            data={currentUserEvents}
            numColumns={3}
            horizontal={false}
            renderItem={({ item }) => (
              <View style={styles.containerImage}>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </View>
            )}
          /> */}

          <FlatList
            data={userEvents}
            renderItem={(event) => (
              // when the card is pressed, we head to EventDetails page
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EventDetails", {
                    event: event,
                  })
                }
              >
                <Card event={event.item} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
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
  alreadyFriend: {
    flex: 1 / 10,
    marginHorizontal: windowWidth * 0.028,
    marginTop: 8,
    height: "7%",
    backgroundColor: "lightgrey",
    borderRadius: 10,
    justifyContent: "center",
  },
  alreadyFriendText: {
    textAlign: "center",
    color: "#666666",
    fontSize: windowWidth * 0.045,
  },

  /* toggle button */
  toggleContainer: {
    flex: 1 / 8,
    flexDirection: "row",
    marginHorizontal: windowWidth * 0.028,
    marginTop: 22,
    height: "7%",
    backgroundColor: "#ededed",
    borderRadius: 30,
    borderWidth: 0.3,
    borderColor: "grey",
  },

  // when upcoming button is clicked
  upcomingEventsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 30,
    height: "97%",
    justifyContent: "center",
    // flexDirection: "row",
  },
  eventsAddedGreyTextContainer: {
    flex: 1,
    height: "97%",
    justifyContent: "center",
  },
  eventsAddedGreyText: {
    color: "#BDBDBD",
    fontWeight: "500",
    fontSize: windowWidth * 0.043,
    textAlign: "center",
  },

  // when events added button is clicked
  eventsAddedContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 30,
    height: "97%",
    justifyContent: "center",
  },
  upcomingEventsGreyTextContainer: {
    flex: 1,
    height: "97%",
    justifyContent: "center",
  },
  upcomingEventsGreyText: {
    color: "#BDBDBD",
    fontWeight: "500",
    fontSize: windowWidth * 0.043,
    textAlign: "center",
  },

  toggleText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: windowWidth * 0.043,
    color: "#5DB075",
  },
});

export default ProfileFollowing;
