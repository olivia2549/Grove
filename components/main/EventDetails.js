/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * EventDetails.js
 * Displays the details of an event
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { parseDate } from "./Card";
import { InviteFriends } from "./InviteFriends";
import firebase from "firebase";
import { FancyInput } from "../styling";
import { useNavigation } from '@react-navigation/native';
import {useSelector} from "react-redux";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// const onShare = async () => {
//   try {
//     const result = await Share.share({
//       message:
//         "*User* is inviting you to *event*. Check it out on Grove! *link*",
//     });
//     if (result.action === Share.sharedAction) {
//       if (result.activityType) {
//         // shared with activity type of result.activityType
//       } else {
//         // shared
//       }
//     } else if (result.action === Share.dismissedAction) {
//       // dismissed
//     }
//   } catch (error) {
//     alert(error.message);
//   }
// };


// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({ navigation, route }) => {
  // get the parameters
  const event = route.params.event.item;
  const start = parseDate(event.startDateTime.toDate());
  const end = parseDate(event.endDateTime.toDate());

  const currentUserID = useSelector(state => state.currentUser.ID);

  const [interestedColor, setInterestedColor] = useState("#5DB075")

  // title font size
  const [currentFont, setCurrentFont] = useState(50);

  // TODO: Fetch attendees from redux and make sure front end updates

  // Goes back to feed when user swipes down from top
  const onSwipeDown = (gestureState) => {
    navigation.goBack();
  };

  // When the "i'm interested" button is pressed
  const onInterested = () => {
    // add current user to "attendees" collection
    firebase
        .firestore()
        .collection("events")
        .doc(event.ID)
        .collection("attendees")
        .doc(currentUserID)
        .set({});
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <View style={styles.container}>
      {/* <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{flex: 1}}
                    > */}

      <GestureRecognizer
        onSwipeDown={(state) => onSwipeDown(state)}
        config={config}
        style={styles.topBar}
      >
        <Text
          adjustsFontSizeToFit
          style={[styles.eventName, { fontSize: currentFont }]}
          onTextLayout={(e) => {
            const { lines } = e.nativeEvent;
            if (lines.length > 1) {
              setCurrentFont(currentFont - 1);
            }
          }}
        >
          {event.name}
        </Text>
      </GestureRecognizer>

      {/* <ScrollView style={styles.scrollStyle}> */}
      <ScrollView style={{ flex: Platform.OS === "ios" ? 0 : 7 }}>
        <View style={styles.rowFlexContainer}>
          {event.tags.map((tag) => (
            <View style={styles.tagBox}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </View>

        <View style={styles.bigView}>
          {/* WHERE */}
          <View style={styles.rowFlexContainer}>
            <Text style={styles.whereWhen}>Where</Text>
            <View style={styles.locationView}>
              {/* this is hard coded, would need to be changed once we fetch info from the data */}
              <Text style={styles.locationText}>{event.location}</Text>
            </View>
          </View>

          {/* START */}
          <View style={styles.timeView}>
            <Text style={styles.startText}>Starts</Text>

            <View style={styles.startView}>
              <Text style={styles.startDayText}>{start.day}</Text>
            </View>
            <View style={styles.startTimeView}>
              <Text style={styles.startTimeText}>{start.ampmTime}</Text>
            </View>
          </View>

          {/* END */}
          <View style={styles.timeView}>
            <Text style={styles.endsText}>Ends</Text>
            <View style={styles.endDayView}>
              <Text style={styles.endDayText}>{end.day}</Text>
            </View>
            <View style={styles.endTimeView}>
              <Text style={styles.endTimeText}>{end.ampmTime}</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidContainer}
        >
          <Text style={styles.peopleGoingText}>
            {event.attendees.length} people going
          </Text>
        </KeyboardAvoidingView>
      </ScrollView>

      <View style={styles.rowFlexContainer}>
        {/*Invite button*/}
        <TouchableOpacity onPress={() => navigation.navigate("InviteFriends", {
          name: event.name,
          description: event.description,
          tags: event.tags,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          location: event.location,
          attendees: event.attendees,
        })} style={styles.fancyButtonContainer}>
          <Text style={styles.fancyButtonText}>Invite</Text>
        </TouchableOpacity>

        {/*I'm Interested button*/}
        <TouchableOpacity
            onPress={onInterested}
            style={[styles.fancyButtonContainer, {backgroundColor: interestedColor, flex: 2/3}]}>
          <Text style={styles.fancyButtonText}>{goingBtnText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    backgroundColor: "#5DB075",
    width: "100%",
    justifyContent: "center",
    flex: 1, // Platform.OS === "ios" ? 0.7 : 1
  },
  tagBox: {
    height: windowHeight * 0.07,
    backgroundColor: "lightgrey",
    marginLeft: 15,
    borderRadius: 10,
    justifyContent: "center",
    padding: 13,
    marginTop: 10,
  },

  // for event details
  eventName: {
    color: "#ffffff",
    fontWeight: "600",
    padding: 20,
  },
  scrollable: {
    flex: 7,
  },

  // for Share and I'm Going Buttons
  buttonContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    top: "130%",
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
    flex: 1/3,
    justifyContent: "center",
  },
  fancyButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
    textAlign: "center",
  },
  tagText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: windowWidth * 0.05,
  },
  whereWhen: {
    fontSize: windowWidth * 0.06,
    fontWeight: "bold",
    marginTop: 3,
    // marginBottom: windowHeight * 0.015,
  },
  locationView: {
    flex: 1,
    marginLeft: windowWidth * 0.02,
    justifyContent: "center",
    height: windowHeight * 0.055,
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
  locationText: {
    marginLeft: windowWidth * 0.03,
    color: "black",
    fontSize: windowWidth * 0.05,
  },
  timeView: {
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 1,
  },
  scrollStyle: {
    flex: Platform.OS === "ios" ? 0 : 7, //
  },
  descriptionContainer: {
    padding: windowWidth * 0.05,
  },
  descriptionText: {
    fontSize: windowWidth * 0.07,
  },
  bigView: {
    justifyContent: "center",
    padding: windowWidth * 0.05,
  },
  rowFlexContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  startText: {
    fontSize: windowWidth * 0.06,
    fontWeight: "bold",
    marginTop: 3,
  },
  startView: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
    height: windowHeight * 0.055,
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
  startDayText: {
    marginLeft: windowWidth * 0.03,
    color: "black",
    fontSize: windowWidth * 0.05,
  },
  startTimeView: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
    height: windowHeight * 0.055,
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
  startTimeText: {
    marginLeft: windowWidth * 0.03,
    color: "black",
    fontSize: windowWidth * 0.05,
  },
  endsText: {
    fontSize: windowWidth * 0.06,
    fontWeight: "bold",
    marginTop: 2,
  },
  peopleGoingText: {
    fontSize: windowWidth * 0.07,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.01,
  },
  endDayView: {
    flex: 1,
    marginLeft: 25,
    justifyContent: "center",
    height: windowHeight * 0.055,
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
  endDayText: {
    marginLeft: windowWidth * 0.03,
    color: "black",
    fontSize: windowWidth * 0.05,
  },
  endTimeView: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
    height: windowHeight * 0.055,
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
  endTimeText: {
    marginLeft: windowWidth * 0.03,
    color: "black",
    fontSize: windowWidth * 0.05,
  },
  keyboardAvoidContainer: {
    justifyContent: "center",
    padding: windowWidth * 0.05,
    flex: 7,
  },
});

export default EventDetails;
