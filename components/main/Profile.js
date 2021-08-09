/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Profile.js
 * Create/edit user profile
 */

import React, { useEffect, useState, useCallback } from "react";
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
  Keyboard,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";

import { Card } from "./Card";

import { useSelector, useDispatch } from "react-redux";
import { clearUserData } from "../../redux/actions";
import { changeProfile } from "../../redux/actions";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import firebase from "firebase";
import { FancyInput } from "../styling";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// Waiting for feed to refresh
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const currentUser = useSelector((state) => state.currentUser);

  // for the toggle (a person you're following)
  const [upComingEvents, setUpComingEvents] = useState(true);
  const [eventsAttended, setEventsAttended] = useState(false);
  const [toggleSide, setToggleSide] = useState("flex-start");

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: currentUser.name,
    year: currentUser.year,
    major: currentUser.major,
    bio: currentUser.bio,
  });

  const currentUserID = useSelector((state) => state.currentUser.ID);

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // for the list of events
  const [events, setEvents] = useState([]); // for normal upcoming events
  const [attendedEvents, setAttendedEvents] = useState([]); // for events attended

  /* For refreshing! */
  const [refreshing, setRefreshing] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  // Refreshes feed if pulled up
  const onRefresh = useCallback(() => {
    toggleSide === "flex-start"
      ? setLoadingUpcoming(true)
      : setLoadingPopular(true);
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snapshot) => {
        const tempEventsAttended = [];
        const tempUpcomingEvents = [];
        const date = new Date();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.attendees.length > 0) {
            /// FOR EVENTS ATTENDED
            // add the event if and only if the event has ended and the displaying user's id is part of the event's attendees list
            data.attendees.forEach((person) => {
              date >= data.endDateTime.toDate() &&
                person.id === currentUserID &&
                !tempEventsAttended.includes(data) &&
                tempEventsAttended.push(data);
            });

            /// FOR UPCOMING EVENTS
            // events from the current time and so on AND the user displaying is attending this event
            data.attendees.forEach((person) => {
              date <= data.startDateTime.toDate() &&
                person.id === currentUserID &&
                !tempUpcomingEvents.includes(doc.data()) &&
                tempUpcomingEvents.push(doc.data());
            });
          }
        });

        // sorting with most recent on on top
        if (tempEventsAttended.length > 1) {
          tempEventsAttended.sort(
            (a, b) => a.startDateTime.toDate() - b.startDateTime.toDate()
          );
        }
        if (tempUpcomingEvents.length > 1) {
          tempUpcomingEvents.sort(
            (a, b) => a.startDateTime.toDate() - b.startDateTime.toDate()
          );
        }
        setEvents(tempUpcomingEvents);
        setAttendedEvents(tempEventsAttended);
        setIsLoadingEvents(false);
      });
  }, [isLoadingUser]);

  const signOut = () => {
    firebase.auth().signOut();
    dispatch(clearUserData());
  };

  const doneEditing = () => {
    setIsEditing(false);
    dispatch(changeProfile(profile));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.screenContainer}>
        <View style={styles.userNameContainer}>
          <Text style={styles.userNameText}>{currentUser.name}</Text>
        </View>

        <View style={styles.profileBackground}>
          <Image
            source={require("../../assets/profileicon.jpg")}
            style={styles.profilePic}
          />
        </View>
        {console.log("userid: " + currentUser.ID)}

        {!isEditing && (
          <View style={styles.infoView}>
            <View style={styles.containerInfo}>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <MaterialCommunityIcons
                  name="pencil-circle"
                  color="gray"
                  size={26}
                />
              </TouchableOpacity>

              <Text style={styles.userEmail}>{currentUser.name}</Text>
              {currentUser.year === -1 ? (
                <Text style={styles.userEmail}>Unknown class</Text>
              ) : (
                <Text style={styles.userEmail}>
                  Class of {currentUser.year}
                </Text>
              )}
              {currentUser.major === "" ? (
                <Text style={styles.userEmail}>Undecided major</Text>
              ) : (
                <Text style={styles.userEmail}>{currentUser.major}</Text>
              )}
              {currentUser.bio !== "" && (
                <Text style={styles.userEmail}>{currentUser.bio}</Text>
              )}
            </View>

            <TouchableOpacity onPress={signOut} style={styles.signOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            {/* Toggle Button */}
            <TouchableOpacity
              style={[styles.toggleContainer, { justifyContent: toggleSide }]}
              onPress={() => {
                toggleSide === "flex-start"
                  ? setToggleSide("flex-end")
                  : setToggleSide("flex-start");
              }}
              activeOpacity="0.77"
            >
              {/* upcoming events pressed */}
              {toggleSide === "flex-start" && (
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={styles.upcomingEventsContainer}>
                    <Text style={styles.toggleText}>Upcoming Events</Text>
                  </View>
                  <View style={styles.eventsAddedGreyTextContainer}>
                    <Text style={styles.eventsAddedGreyText}>
                      Events Attended
                    </Text>
                  </View>
                </View>
              )}

              {/* events attended pressed */}
              {toggleSide === "flex-end" && (
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
            {toggleSide === "flex-start" && (
              <View style={{ justifyContent: "center", margin: 15, flex: 1 }}>
                {events.length === 0 ? (
                  <Text>Loading...</Text>
                ) : (
                  <FlatList
                    style={{ height: windowHeight * 0.44 }}
                    data={events}
                    keyExtractor={(item, index) => item.ID}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                    renderItem={(event) => (
                      // when the card is pressed, we head to EventDetails page
                      <TouchableOpacity
                        key={event.item.ID}
                        onPress={() =>
                          navigation.navigate("EventDetails", {
                            ID: event.item.ID,
                          })
                        }
                      >
                        <Card
                          key={event.item.ID}
                          id={event.item.ID}
                          loading={true}
                        />
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}

            {toggleSide === "flex-end" && (
              <View style={{ justifyContent: "center", margin: 15, flex: 1 }}>
                {events.length === 0 ? (
                  <Text>Loading...</Text>
                ) : (
                  <FlatList
                    style={{ height: windowHeight * 0.44 }}
                    data={attendedEvents}
                    keyExtractor={(item, index) => item.ID}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                    renderItem={(event) => (
                      // when the card is pressed, we head to EventDetails page
                      <TouchableOpacity
                        key={event.item.ID}
                        onPress={() =>
                          navigation.navigate("EventDetails", {
                            ID: event.item.ID,
                          })
                        }
                      >
                        <Card
                          key={event.item.ID}
                          id={event.item.ID}
                          loading={true}
                        />
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}
          </View>
        )}
        {isEditing && (
          <View style={styles.infoView}>
            <View style={styles.containerInfo}>
              <FancyInput
                style={styles.userEmail}
                placeholder={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
              />
              <FancyInput
                style={styles.userEmail}
                placeholder={profile.year}
                onChangeText={(text) => setProfile({ ...profile, year: text })}
              />
              <FancyInput
                style={styles.userEmail}
                placeholder={profile.major}
                onChangeText={(text) => setProfile({ ...profile, major: text })}
              />
              <FancyInput
                style={styles.userEmail}
                placeholder={profile.bio}
                onChangeText={(text) => setProfile({ ...profile, bio: text })}
              />
            </View>

            <TouchableOpacity onPress={doneEditing} style={styles.signOut}>
              <Text style={styles.signOutText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
    height: 35,
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
    height: 35,
    flexDirection: "row",
    marginHorizontal: windowWidth * 0.028,
    marginTop: 22,
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

export default Profile;
