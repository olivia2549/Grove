/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Profile.js
 * Create/edit user profile
 */

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
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

import { Card } from "./Card";

import { useSelector, useDispatch } from "react-redux";
import { clearData } from "../../redux/actions";

import firebase from "firebase";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Profile = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userDisplayingID = route.params.uid; // user to display
  const [userDisplaying, setUserDisplaying] = useState({});

  const currentUserID = useSelector((state) => state.currentUser.ID);

  const friends = useSelector((state) => state.currentUser.friends);
  const [isFriend, setIsFriend] = useState(false);

  const currentUserEvents = useSelector(
    (state) => state.currentUser.eventsPosted
  );

  // for the toggle (a person you're following)
  const [upComingEvents, setUpComingEvents] = useState(true);
  const [eventsAttended, setEventsAttended] = useState(false);
  const [toggleSide, setToggleSide] = useState("flex-start");

  useEffect(
    () => {
      const fetchUserToDisplay = async () => {
        const user = await firebase
          .firestore()
          .collection("users")
          .doc(userDisplayingID)
          .get();
        setUserDisplaying(user.data());
      };
      fetchUserToDisplay();
      friends.indexOf(userDisplayingID) > -1
        ? setIsFriend(true)
        : setIsFriend(false);
    },
    [route.params.uid],
    [friends]
  ); // only gets called if userToDisplay or friends changes

  const signOut = () => {
    firebase.auth().signOut();
    dispatch(clearUserData());
  };

  // Adds a friend
  const addFriend = () => {
    // add searched person to the current user's friends list
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserID)
      .collection("friends")
      .doc(userDisplayingID)
      .set({});
    // add current user to the searched person's friend list
    firebase
      .firestore()
      .collection("users")
      .doc(userDisplayingID)
      .collection("friends")
      .doc(currentUserID)
      .set({});
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

  const ProfileFollowing = () => {
    return (
      <View>
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
          <FlatList
            data={currentUserEvents}
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
    );
  };

  const ProfileNotFollowing = () => {
    if (userDisplayingID !== currentUserID) {
      return (
        <View>
          <TouchableOpacity onPress={addFriend} style={styles.addFriend}>
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
        </View>
      );
    } else {
      return <View />;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>{userDisplaying.name}</Text>
      </View>

      <View style={styles.profileBackground}>
        <Image
          source={require("../../assets/profileicon.jpg")}
          style={styles.profilePic}
        />
      </View>

      <View style={styles.infoView}>
        <View style={styles.containerInfo}>
          <Text style={styles.userEmail}>{userDisplaying.email}</Text>
        </View>

        {isFriend ? <ProfileFollowing /> : <ProfileNotFollowing />}

        {userDisplayingID === currentUserID && (
          <TouchableOpacity onPress={signOut} style={styles.signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
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
  addFriend: {
    flex: 2,
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
    fontSize: windowWidth * 0.045,
    padding: 8,
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
    flex: 1 / 12,
    marginHorizontal: 12,
    marginLeft: 18,
    marginBottom: 6,
    backgroundColor: "#5DB075",
    borderRadius: 10,
    justifyContent: "center",
  },
  signOutText: {
    textAlign: "center",
    color: "white",
    fontSize: windowWidth * 0.045,
  },
  // add friend
  alreadyFriend: {
    flex: 2,
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
    padding: 10,
  },
  /* toggle button */
  toggleContainer: {
    flex: 2,
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
    padding: 8,
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
    padding: 8,
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

export default Profile;
