/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * ProfileUser.js
 * Profile page for someone you searched
 */

import React, { useState, useEffect, useCallback } from "react";
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
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// firebase imports
import firebase from "firebase";
require("firebase/firestore");

import { useSelector, useDispatch } from "react-redux";
import { fetchUserOutgoingRequests } from "../../redux/actions";

import { Card } from "./Card";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

//waiting for feed to refresh
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const ProfileUser = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const currentUserID = useSelector((state) => state.currentUser.ID);
  const userDisplayingID = route.params.uid; // user to display
  const [userDisplaying, setUserDisplaying] = useState({});

  const friends = useSelector((state) => state.currentUser.friends);

  const outgoingRequests = useSelector(
    (state) => state.currentUser.outgoingRequests
  );

  // for the list of events
  const [events, setEvents] = useState([]); // for normal upcoming events
  const [attendedEvents, setAttendedEvents] = useState([]); // for normal upcoming events
  const [refreshing, setRefreshing] = useState(false);

  // for the switch
  const [upComingEvents, setUpComingEvents] = useState(true);
  const [eventsAttended, setEventsAttended] = useState(false);
  const [toggleSide, setToggleSide] = useState("flex-start");

  useEffect(() => {
    const fetchUserToDisplay = async () => {
      const user = await firebase
        .firestore()
        .collection("users")
        .doc(userDisplayingID)
        .get();
      setUserDisplaying(user.data());
    };
    fetchUserToDisplay();

    // for the upcoming events
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snapshot) => {
        const tempEventsAttended = [];
        const tempUpcomingEvents = [];
        const date = new Date();
        snapshot.forEach((doc) => {
          if (doc.data().attendees.length > 0) {
            /// FOR EVENTS ATTENDED
            // add the event if and only if the event has ended and the displaying user's id is part of the event's attendees's list
            doc.data().attendees.forEach((person) => {
              date >= doc.data().endDateTime.toDate() &&
                person.id === userDisplayingID &&
                !tempEventsAttended.includes(doc.data()) &&
                tempEventsAttended.push(doc.data());
            });

            /// FOR UPCOMING EVENTS
            // events from the current time and so on AND the user displaying is attending this event
            doc.data().attendees.forEach((person) => {
              date <= doc.data().startDateTime.toDate() &&
                person.id === userDisplayingID &&
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
      });
  }, [route.params.uid]);

  //refreshes feed if pulled up
  const onRefresh = useCallback(() => {
    console.log(events);
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snapshot) => {
        const temp = [];
        snapshot.forEach((doc) => {
          if (doc.data().attendees.length > 0) {
            /// FOR UPCOMING EVENTS
            doc.data().attendees.forEach((person) => {
              date <= doc.data().startDateTime.toDate() &&
                person.id === userDisplayingID &&
                !temp.includes(doc.data());
              temp.push(doc.data());
            });
          }
        });
        if (temp.length > 1) {
          temp.sort(
            (a, b) => a.startDateTime.toDate() - b.startDateTime.toDate()
          );
        }
        setEvents(temp);
      });

    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // for refershing events addended
  const onAttendedEventsRefresh = useCallback(() => {
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snapshot) => {
        const temp = [];
        snapshot.forEach((doc) => {
          if (doc.data().attendees.length > 0) {
            /// FOR EVENTS ATTENDED
            doc.data().attendees.forEach((person) => {
              date >= doc.data().endDateTime.toDate() &&
                person.id === userDisplayingID &&
                !temp.includes(doc.data());
              temp.push(doc.data());
            });
          }
        });
        if (temp.length > 1) {
          temp.sort(
            (a, b) => a.startDateTime.toDate() - b.startDateTime.toDate()
          );
        }
        setAttendedEvents(temp);
      });

    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // Adds a friend
  const addFriend = (id) => {
    // add searched person to the current user's outgoingRequests list
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserID)
      .collection("outgoingRequests")
      .doc(id)
      .set({});
    // add current user to the searched person's incomingRequests list
    firebase
      .firestore()
      .collection("users")
      .doc(id)
      .collection("incomingRequests")
      .doc(currentUserID)
      .set({});
    dispatch(fetchUserOutgoingRequests());
  };

  const flipToggle = () => {
    if (upComingEvents) {
      setToggleSide("flex-end");
    } else if (eventsAttended) {
      setToggleSide("flex-start");
    }
    setUpComingEvents(!upComingEvents);
    setEventsAttended(!eventsAttended);
  };

  if (userDisplaying === null) {
    return <Text>Loading...</Text>;
  }

  const ProfileFollowing = () => {
    return (
      <View style={{ justifyContent: "center" }}>
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
        {upComingEvents && (
          <View style={{ justifyContent: "center", margin: 15 }}>
            {events.length === 0 ? (
              <Text>Loading...</Text>
            ) : (
              <FlatList
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
                    key={event.id}
                    onPress={() =>
                      navigation.navigate("EventDetails", {
                        ID: event.item.ID,
                      })
                    }
                  >
                    <Card key={event.item.ID} id={event.item.ID} />
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}

        {eventsAttended && (
          <View style={{ justifyContent: "center", margin: 15 }}>
            {events.length === 0 ? (
              <Text>Loading...</Text>
            ) : (
              <FlatList
                data={attendedEvents}
                keyExtractor={(item, index) => item.ID}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onAttendedEventsRefresh}
                  />
                }
                renderItem={(event) => (
                  // when the card is pressed, we head to EventDetails page
                  <TouchableOpacity
                    key={event.id}
                    onPress={() =>
                      navigation.navigate("EventDetails", {
                        ID: event.item.ID,
                      })
                    }
                  >
                    <Card key={event.item.ID} id={event.item.ID} />
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </View>
    );
  };

  const ProfileNotFollowing = (props) => {
    return (
      <View>
        {props.requested ? (
          <TouchableOpacity style={styles.requested}>
            <Text style={styles.alreadyFriendText}>Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              addFriend(userDisplayingID);
            }}
            style={styles.addFriend}
          >
            <Text style={styles.addFriendText}>Add Friend</Text>
          </TouchableOpacity>
        )}

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
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>{userDisplaying.name}</Text>
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
          <Text style={styles.userEmail}>{userDisplaying.email}</Text>
        </View>
        {friends.indexOf(userDisplayingID) > -1 && <ProfileFollowing />}
        {outgoingRequests.indexOf(userDisplayingID) > -1 && (
          <ProfileNotFollowing requested={true} />
        )}
        {friends.indexOf(userDisplayingID) === -1 &&
          outgoingRequests.indexOf(userDisplayingID) === -1 && (
            <ProfileNotFollowing requested={false} />
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

  // lock icon
  lockContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 10,
    // marginTop: 10, // margin: 15,
  },
  lockIcon: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
  },
  lockIconText: {
    marginTop: 6,
  },

  // add friend
  alreadyFriend: {
    height: 35,
    marginHorizontal: 15,
    marginTop: 8,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    justifyContent: "center",
  },
  alreadyFriendText: {
    textAlign: "center",
    color: "#666666",
    fontSize: windowWidth * 0.045,
  },

  // requested
  requested: {
    backgroundColor: "#E8E8E8",
    height: 35,
    borderRadius: 10,
    marginHorizontal: 15,
    justifyContent: "center",
  },

  // addFriend
  addFriend: {
    backgroundColor: "#5DB075",
    height: 35,
    borderRadius: 10,
    marginHorizontal: 15,
    justifyContent: "center",
  },
  addFriendText: {
    textAlign: "center",
    color: "white",
    fontSize: windowWidth * 0.045,
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

export default ProfileUser;
