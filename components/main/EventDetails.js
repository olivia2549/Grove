/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * EventDetails.js
 * Displays the details of an event
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Image,
  Button,
  FlatList,
  Share,
  Alert,
  SafeAreaView,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import firebase from "firebase";
import { useSelector } from "react-redux";
import UserImageName from "./UserImageName";
import { parseDate, fetchFromFirebase } from "../../shared/HelperFunctions";
import { Tooltip } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FancyButton, FancyButtonButLower, FancyInput } from "../styling";
import {logEvent, setCurrentScreen, setDebugModeEnabled} from "expo-firebase-analytics";
// import {SafeAreaView} from "react-native-web";

// for sending an email
// import * as admin from "firebase-admin";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({ navigation, route }) => {
  setDebugModeEnabled(true);
  setCurrentScreen("EventDetails");

  const currentUserID = firebase.auth().currentUser.uid;
  const currentUserRef = firebase
    .firestore()
    .collection("users")
    .doc(currentUserID);
  const currentUserName = useSelector((state) => state.currentUser.name);

  const eventDisplayingID = route.params.ID;
  const [eventDisplaying, setEventDisplaying] = useState({});
  const [startDateString, setStartDateString] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [interestedColor, setInterestedColor] = useState("#5DB075");
  const [interestedTextColor, setInterestedTextColor] = useState("#ffffff");

  const [fontSizeChangePossible, setFontSizeChangePossible] = useState(true); // to limit the re-rendering number
  const [currentFont, setCurrentFont] = useState(50); // title font size

  const [viewingAttendees, setViewingAttendees] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [backgroundColorTags, setBackgroundColorTags] = useState("lightgray");
  const [backgroundColorHeader, setBackgroundColorHeader] = useState("#5db075");
  const [reportDetails, setReportDetails] = useState("");

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };
  const refRBSheet = useRef();
  const refTooltip = useRef();

  // Fetch event, and set eventDisplaying
  useEffect(() => {
    if (isLoading) {
      fetchFromFirebase(eventDisplayingID, "events").then((data) => {
        if (data.data()) setEventDisplaying(data.data());
        setIsLoading(false);
      });
    }
    if (!isLoading) {
      eventDisplaying.attendees.forEach((attendeeRef) => {
        if (attendeeRef.isEqual(currentUserRef)) {
          setInterestedColor("lightgray");
          setInterestedTextColor("black");
        }
      });
      setStartDateString(
        parseDate(eventDisplaying.startDateTime.toDate()).day +
          ", " +
          parseDate(eventDisplaying.startDateTime.toDate()).month +
          " " +
          parseDate(eventDisplaying.startDateTime.toDate()).date
      );
    }
  }, [isLoading]);

  // When the "interested" button is pressed
  const onInterested = () => {
    logEvent("InterestedPressed");
    // add current user to "attendees" array of eventDisplaying
    const eventRef = firebase
      .firestore()
      .collection("events")
      .doc(eventDisplayingID);
    eventRef.update({
      attendees: firebase.firestore.FieldValue.arrayUnion(currentUserRef),
    });
    const userRef = firebase.firestore().collection("users").doc(currentUserID);
    userRef.update({
      eventsAttending: firebase.firestore.FieldValue.arrayUnion(eventRef),
    });
    setInterestedColor("lightgray");
    setInterestedTextColor("black");
  };

  // Send a message about the event to someone
  const onShare = async () => {
    logEvent("SharePressed");
    try {
      const result = await Share.share({
        message: `${currentUserName} is inviting you to ${eventDisplaying.name}. Check it out on Grove! https://testflight.apple.com/join/nPGf2WBL`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const sendReport = () => {
    // var admin = require("firebase-admin"); - i can't use admin on a client side
    const emailRef = firebase
      .firestore()
      .collection("mail")
      .add({
        to: "grovecollegehelp@gmail.com",
        message: {
          subject: "Event Report from User " + currentUserName,
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

  if (isLoading) return <Text>Loading...</Text>;

  // setting the event name font
  if (fontSizeChangePossible && eventDisplaying.name.length > 15) {
    setCurrentFont(33);
    setFontSizeChangePossible(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GestureRecognizer
        onSwipeDown={() => navigation.goBack()}
        config={config}
      >
        {/*Top bar*/}
        <View
          style={[
            styles.topBarContainer,
            { backgroundColor: backgroundColorHeader },
          ]}
        >
          <View style={styles.topBar}>
            <View style={styles.topBarButtons}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  color={"white"}
                  size={35}
                />
              </TouchableOpacity>
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
            <View style={styles.eventNameContainer}>
              <Text adjustsFontSizeToFit style={styles.eventNameText}>
                {eventDisplaying.name}
              </Text>
            </View>
          </View>
        </View>

        {!viewingAttendees && (
          <View style={styles.eventInfoContainer}>
            <View style={styles.infoContainers}>
              {eventDisplaying.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.eachTag,
                    { backgroundColor: backgroundColorTags },
                  ]}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={styles.infoContainers}>
              <Text style={styles.descriptionText}>
                {eventDisplaying.description}
              </Text>
            </View>

            {/* WHERE */}
            <View style={styles.infoContainers}>
              <View style={styles.whereWhenContainer}>
                <View style={styles.whereWhenTitlesContainer}>
                  <Text style={styles.whereWhenTitles}>Where</Text>
                </View>
                <View style={styles.whereWhenTitlesContainer}>
                  <Text style={styles.whereWhenTitles}>Starts</Text>
                </View>
              </View>
              <View style={styles.whereWhenContainer}>
                <View style={styles.locationRowContainer}>
                  <View
                    style={[
                      styles.locationView,
                      { backgroundColor: backgroundColorTags },
                    ]}
                  >
                    <Text style={styles.locationText}>
                      {eventDisplaying.location}
                    </Text>
                  </View>
                </View>
                <View style={styles.locationRowContainer}>
                  <View
                    style={[
                      styles.dateView,
                      { backgroundColor: backgroundColorTags },
                    ]}
                  >
                    <Text style={styles.locationText}>{startDateString}</Text>
                  </View>
                  <View
                    style={[
                      styles.timeView,
                      { backgroundColor: backgroundColorTags },
                    ]}
                  >
                    <Text style={styles.locationText}>
                      {
                        parseDate(eventDisplaying.startDateTime.toDate())
                          .ampmTime
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.shareAndInterestedButtons}>
              {/*Invite button*/}
              <TouchableOpacity
                onPress={onShare}
                style={styles.fancyButtonContainer}
              >
                <Text style={styles.fancyButtonText}>Share</Text>
              </TouchableOpacity>

              {/*I'm Interested button*/}
              <TouchableOpacity
                onPress={onInterested}
                style={[
                  styles.fancyButtonContainer,
                  { backgroundColor: interestedColor, flex: 2 / 3 },
                ]}
              >
                <Text
                  style={[
                    styles.fancyButtonText,
                    { color: interestedTextColor },
                  ]}
                >
                  Interested
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </GestureRecognizer>

      <GestureRecognizer
        onSwipeUp={() => setViewingAttendees(true)}
        onSwipeDown={() => setViewingAttendees(false)}
        config={config}
        style={styles.peopleInterested}
      >
        {!viewingAttendees ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => setViewingAttendees(true)}>
              <MaterialCommunityIcons
                name="chevron-up"
                color={"black"}
                size={35}
              />
            </TouchableOpacity>
            <Text style={styles.peopleGoingText}>
              People Interested ({eventDisplaying.attendees.length})
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <TouchableOpacity onPress={() => setViewingAttendees(false)}>
              <MaterialCommunityIcons
                name="chevron-down"
                color={"black"}
                size={35}
              />
            </TouchableOpacity>
            <Text style={styles.peopleGoingText}>
              People Interested ({eventDisplaying.attendees.length})
            </Text>
          </View>
        )}

        <View style={styles.peopleInterested}>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={eventDisplaying.attendees}
            onScrollBeginDrag={() => setViewingAttendees(true)}
            keyExtractor={(item, index) => item.id}
            renderItem={(
              { item } // Allows you to render a text item for each user
            ) => (
              <View style={styles.userCellContainer}>
                <TouchableOpacity
                  key={item.id + "row"}
                  onPress={() =>
                    navigation.navigate("ProfileUser", { uid: item.id })
                  }
                >
                  <UserImageName id={item.id} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </GestureRecognizer>

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
          placeholder="Why are you reporting this event?"
          onChangeText={(text) => setReportDetails(text)}
          returnKeyType="done"
        />
        <View style={styles.reportButtonContainer}>
          <FancyButtonButLower
            title="Report"
            onPress={() => {
              sendReport();
              refRBSheet.current.close();
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  topBarContainer: {
    backgroundColor: "#5db075",
    flexDirection: "column-reverse",
    justifyContent: "space-around",
    height: 200,
  },
  topBar: {
    flexDirection: "column",
    justifyContent: "center",
    margin: 10,
    marginTop: 20,
  },
  topBarButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventNameContainer: {
    alignContent: "flex-end",
  },
  eventNameText: {
    color: "white",
    fontWeight: "500",
    fontSize: 36,
    textAlign: "center",
  },
  eventInfoContainer: {
    margin: 15,
  },
  reportButtonContainer: {
    position: "absolute",
    bottom: 35,
    width: "100%",
    justifyContent: "center",
  },
  infoContainers: {
    marginTop: 15,
    marginBottom: 15,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  eachTag: {
    backgroundColor: "lightgray",
    borderRadius: 20,
    padding: 20,
    marginRight: 10,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 20,
    fontWeight: "600",
  },
  descriptionText: {
    fontSize: 20,
  },
  whereWhenContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  whereWhenTitlesContainer: {
    height: 50,
    marginBottom: 5,
    justifyContent: "center",
  },
  whereWhenTitles: {
    fontSize: 24,
    fontWeight: "bold",
  },
  whereWhenRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  locationRowContainer: {
    marginLeft: 15,
    flexDirection: "row",
    width: windowWidth * 0.71,
    justifyContent: "space-between",
  },
  locationView: {
    borderRadius: 10,
    backgroundColor: "lightgray",
    paddingLeft: 15,
    justifyContent: "center",
    height: 50,
    marginBottom: 5,
    width: "100%",
  },
  timeView: {
    flex: 3 / 7,
    borderRadius: 10,
    backgroundColor: "lightgray",
    paddingLeft: 15,
    justifyContent: "center",
    alignContent: "center",
    height: 50,
  },
  dateView: {
    flex: 4 / 7,
    borderRadius: 10,
    backgroundColor: "lightgray",
    paddingLeft: 15,
    justifyContent: "center",
    height: 50,
    marginBottom: 5,
    marginRight: 5,
  },
  locationText: {
    fontSize: 20,
  },
  peopleGoingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.01,
  },
  peopleInterested: {
    marginLeft: 15,
    justifyContent: "flex-start",
  },
  fancyButtonContainer: {
    elevation: 8,
    backgroundColor: "#5DB075",
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    flex: 1 / 3,
    justifyContent: "center",
  },
  fancyButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
    textAlign: "center",
  },
  shareAndInterestedButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

export default EventDetails;
