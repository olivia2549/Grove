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
  const user = props.userRef.get().then(doc => doc.data());

  // for the switch
  const [upComingEvents, setUpComingEvents] = useState(true);
  const [eventsAttended, setEventsAttended] = useState(false);
  const [toggleSide, setToggleSide] = useState("flex-start");

  const signOut = () => {
    firebase.auth().signOut();
    dispatch(clearData());
  };

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
        <TouchableOpacity style={styles.alreadyFriend}>
          <Text style={styles.alreadyFriendText}>Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleContainer, { justifyContent: toggleSide }]}
          onPress={flipToggle}
        >
          {upComingEvents && (
            <View style={styles.upcomingEventsContainer}>
              <Text style={styles.toggleText}>Upcoming Events</Text>
            </View>
          )}

          {eventsAttended && (
            <View style={styles.eventsAddedContainer}>
              <Text style={styles.toggleText}>Events Attended</Text>
            </View>
          )}
        </TouchableOpacity>

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
            data={user.eventsAttending}
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

  // toggle button
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
  upcomingEventsContainer: {
    flex: 1 / 2,
    backgroundColor: "white",
    borderRadius: 30,
    height: "97%",
    justifyContent: "center",
  },
  eventsAddedContainer: {
    flex: 1 / 2,
    backgroundColor: "white",
    borderRadius: 30,
    height: "97%",
    justifyContent: "center",
  },
  toggleText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: windowWidth * 0.043,
    color: "#5DB075",
  },
});

export default ProfileFollowing;
