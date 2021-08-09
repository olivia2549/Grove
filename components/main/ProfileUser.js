/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * ProfileUser.js
 * Profile page for someone you searched
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Alert,
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

// for reporting
import { Tooltip } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FancyButtonButLower, FancyInput } from "../styling";

// firebase imports
import firebase from "firebase";
require("firebase/firestore");

import { useSelector, useDispatch } from "react-redux";
import { fetchUserOutgoingRequests } from "../../redux/actions";

import { Card } from "./Card";
import { fetchFromFirebase } from "../../shared/HelperFunctions";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// Waiting for feed to refresh
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const ProfileUser = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const currentUserName = useSelector((state) => state.currentUser.name);
  const currentUserID = useSelector((state) => state.currentUser.ID);
  const userDisplayingID = route.params.uid; // user to display
  const [userDisplaying, setUserDisplaying] = useState({});

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const friends = useSelector((state) => state.currentUser.friends);
  const outgoingRequests = useSelector(
    (state) => state.currentUser.outgoingRequests
  );

  // for the list of events
  const [events, setEvents] = useState([]); // for normal upcoming events
  const [attendedEvents, setAttendedEvents] = useState([]); // for events attended

  // for the switch
  const [toggleSide, setToggleSide] = useState("flex-start");

  useEffect(() => {
    fetchFromFirebase(userDisplayingID, "users").then((data) => {
      setUserDisplaying(data.data());
      setIsLoadingUser(false);
    });
  }, [isLoadingUser, route.params.uid]);

  useEffect(() => {
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
          const data = doc.data();
          if (data.attendees.length > 0) {
            /// FOR EVENTS ATTENDED
            // add the event if and only if the event has ended and the displaying user's id is part of the event's attendees list
            data.attendees.forEach((person) => {
              date >= data.endDateTime.toDate() &&
                person.id === userDisplayingID &&
                !tempEventsAttended.includes(data) &&
                tempEventsAttended.push(data);
            });

            /// FOR UPCOMING EVENTS
            // events from the current time and so on AND the user displaying is attending this event
            data.attendees.forEach((person) => {
              date <= data.startDateTime.toDate() &&
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
        setIsLoadingEvents(false);
        console.log("attended:");
        attendedEvents.forEach((event) => {
          console.log(event.name, event.attendees.length);
        });
        console.log("upcoming:");
        events.forEach((event) => {
          console.log(event.name, event.attendees.length);
        });
      });
  }, [isLoadingEvents, route.params.uid]);

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

  if (userDisplaying === null) {
    return <Text>Loading...</Text>;
  }

  const ProfileFollowing = () => {
    return (
      <View style={{ justifyContent: "center", marginTop: 20, flex: 1 }}>
        {/* Friends Button */}
        <TouchableOpacity style={styles.alreadyFriend}>
          <Text style={styles.alreadyFriendText}>Friends</Text>
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
                <Text style={styles.eventsAddedGreyText}>Events Attended</Text>
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
          <View style={{ justifyContent: "center", margin: 15 }}>
            {events.length === 0 ? (
              <Text>Loading...</Text>
            ) : (
              <FlatList
                style={{ height: windowHeight * 0.44 }}
                data={events}
                keyExtractor={(item, index) => item.ID}
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
          <View style={{ justifyContent: "center", margin: 15 }}>
            {events.length === 0 ? (
              <Text>Loading...</Text>
            ) : (
              <FlatList
                style={{ height: windowHeight * 0.44 }}
                data={attendedEvents}
                keyExtractor={(item, index) => item.ID}
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

  const refTooltip = useRef();
  const refRBSheet = useRef();
  const [reportDetails, setReportDetails] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [backgroundColorTags, setBackgroundColorTags] = useState("lightgray");
  const [backgroundColorHeader, setBackgroundColorHeader] = useState("#5db075");
  const sendReport = () => {
    // var admin = require("firebase-admin"); - i can't use admin on a client side
    const emailRef = firebase
      .firestore()
      .collection("mail")
      .add({
        to: "grovecollegehelp@gmail.com",
        message: {
          subject: "User Report from User " + currentUserName,
          text: reportDetails,
        },
      })
      .then(() => console.log("email sent!"));
    setBackgroundColor("transparent");
    setBackgroundColorTags("lightgray");
    setBackgroundColorHeader("#5db075");
    wait(600).then(() =>
      Alert.alert(
        "Your report has been sent to our team. Thank you for notifying us."
      )
    );
  };

  const ReportComp = () => {
    return (
      <TouchableOpacity
        style={{ height: "100%", width: "100%", justifyContent: "center" }}
        onPress={() => refRBSheet.current.open()}
      >
        <Text style={{ color: "#F47174", fontSize: 16, textAlign: "center" }}>
          Report
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>{userDisplaying.name}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="chevron-down"
            color={"white"}
            size={35}
          />
        </TouchableOpacity>
        <View style={styles.report}>
          <Tooltip
            ref={refTooltip}
            backgroundColor="white"
            overlayColor="rgba(0, 0, 0, 0.50)"
            height={70}
            popover={<ReportComp />}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              color={"white"}
              size={25}
            />
          </Tooltip>
        </View>
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
          <Text style={styles.userEmail}>{userDisplaying.name}</Text>
          {userDisplaying.year === -1 ? (
            <Text style={styles.userEmail}>Unknown class</Text>
          ) : (
            <Text style={styles.userEmail}>Class of {userDisplaying.year}</Text>
          )}
          {userDisplaying.major === "" ? (
            <Text style={styles.userEmail}>Undecided major</Text>
          ) : (
            <Text style={styles.userEmail}>{userDisplaying.major}</Text>
          )}
          {userDisplaying.bio !== "" && (
            <Text style={styles.userEmail}>{userDisplaying.bio}</Text>
          )}
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

      {/*Report modal*/}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={() => {
          setBackgroundColor("transparent");
          setBackgroundColorTags("lightgray");
          setBackgroundColorHeader("#5db075");
        }}
        onOpen={() => {
          refTooltip.current.toggleTooltip();
          setBackgroundColor("rgba(0, 0, 0, 0.50)");
          setBackgroundColorTags("rgba(0, 0, 0, 0.20)");
          setBackgroundColorHeader("rgba(93, 176, 117, 0.70)");
        }}
        animationType="slide"
        openDuration={100}
        height={windowHeight * 0.6}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            height: "70%",
          },
        }}
      >
        <Text
          style={{
            textAlign: "center",
            margin: 20,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Report
        </Text>
        <FancyInput
          style={{ marginLeft: 10, marginRight: 10 }}
          placeholder="Why are you reporting this user?"
          onChangeText={(text) => setReportDetails(text)}
          returnKeyType="done"
        />
        <View style={styles.reportButtonContainer}>
          <FancyButtonButLower
            title="Report"
            onPress={() => {
              refRBSheet.current.close();
              sendReport();
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  containerInfo: {
    margin: 20,
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
  backButton: {
    position: "absolute",
    left: windowWidth * 0.05,
    top: 55,
  },
  report: {
    position: "absolute",
    left: windowWidth * 0.9,
    top: 55,
  },
  reportButtonContainer: {
    position: "absolute",
    bottom: 35,
    width: "100%",
    justifyContent: "center",
  },

  // lock icon
  lockContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 10,
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
    marginHorizontal: 15,
    marginTop: 8,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    justifyContent: "center",
    height: 35,
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
