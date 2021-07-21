/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventConfirmation.js
 * Previews new event to be posted
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Button,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { InviteFriends } from "./InviteFriends";

import { FancyButtonButLower } from "../styling";
import firebase from "firebase";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const AddEventConfirmation = () => {
  const navigation = useNavigation();

  // Grabs event data from redux, stores as an object
  const eventData = {
    name: useSelector((state) => state.event.name),
    description: useSelector((state) => state.event.description),
    tags: useSelector((state) => state.event.tags),
    startDateTime: useSelector((state) => state.event.startDateTime),
    endDateTime: useSelector((state) => state.event.endDateTime),
    location: useSelector((state) => state.event.location),
    attendees: useSelector(state => state.event.attendees),
  };

  // New event gets added to firebase
  const onSubmit = async () => {
    const docRef = await firebase.firestore().collection("events").doc();
    eventData.ID = docRef.id;
    eventData.creator = await firebase.firestore().collection("users")
        .doc(firebase.auth().currentUser.uid);
    eventData.attendees.push(eventData.creator);
    eventData.nameLowercase = eventData.name.toLowerCase();
    await docRef.set(eventData);
    console.log("Posted to firebase - " + eventData.ID);
    Alert.alert("Event posted");
    navigation.navigate("InviteFriends", {
      name: eventData.name,
      description: eventData.description,
      tags: eventData.tags,
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      location: eventData.location,
      attendees: eventData.attendees,
    });
  };

  // for start and end time translation
  const [startTime, setStartTime] = useState("");
  const [startTimeUnit, setStartTimeUnit] = useState("");
  let startHourInNum = parseInt(
    eventData.startDateTime.toString().substring(16, 18),
    10
  );

  const [endTime, setEndTime] = useState("");
  const [endTimeUnit, setEndTimeUnit] = useState("AM");
  let endHourInNum = parseInt(
    eventData.endDateTime.toString().substring(16, 18),
    10
  );

  useEffect(() => {
    // setting the start hour
    if (startHourInNum >= 12) {
      var hour = startHourInNum - 12;
      setStartTimeUnit("PM");
      setStartTime(
        hour.toString() + eventData.startDateTime.toString().substring(18, 21)
      );
    } else {
      setStartTimeUnit("AM");
      setStartTime(eventData.startDateTime.toString().substring(16, 21));
    }

    // setting the end hour
    if (endHourInNum >= 12) {
      var hour = endHourInNum - 12;
      setEndTimeUnit("PM");
      setEndTime(
        hour.toString() + eventData.endDateTime.toString().substring(18, 21)
      );
    } else {
      setEndTimeUnit("AM");
      setEndTime(eventData.endDateTime.toString().substring(16, 21));
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>
           {eventData.name}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
             {eventData.description}
          </Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
          {eventData.tags.map((tag) => (
            <View key={tag} style={styles.tagContainer}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.bigView}>
          {/* WHERE */}
          <View style={styles.rowFlexContainer}>
            <Text style={styles.whereWhen}>Where</Text>
            <View style={styles.locationView}>
              <Text style={styles.locationText}>{eventData.location}</Text>
            </View>
          </View>

          {/* START */}
          <View style={styles.timeView}>
            <Text style={styles.startText}>Starts</Text>

            <View style={styles.startView}>
              <Text style={styles.startDayText}>
                {eventData.startDateTime.toString().substring(4, 10)}
              </Text>
            </View>
            <View style={styles.startTimeView}>
              <Text style={styles.startTimeText}>
                {`${startTime} ${startTimeUnit}`}
              </Text>
            </View>
          </View>

          {/* END */}
          <View style={styles.timeView}>
            <Text style={styles.endsText}>Ends</Text>
            <View style={styles.endDayView}>
              <Text style={styles.endDayText}>
                {eventData.endDateTime.toString().substring(4, 10)}
              </Text>
            </View>
            <View style={styles.endTimeView}>
              <Text style={styles.startTimeText}>
                {`${endTime} ${endTimeUnit}`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ bottom: windowWidth * 0.1 }}>
        <FancyButtonButLower
          title="Post Event"
          onPress={() => {
            onSubmit();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: Platform.OS === "ios" ? 0 : 7,
    marginTop: windowHeight * 0.24,
    justifyContent: "flex-start",
  },
  topBar: {
    backgroundColor: "#5DB075",
    height: "20%",
    width: "100%",
    position: "absolute",
    top: 0,
    justifyContent: "center",
    flex: 1,
  },
  titleText: {
    color: "#ffffff",
    fontWeight: "600",
    top: "20%",
    padding: 25,
    fontSize: windowWidth * 0.12,
  },

  tagContainer: {
    height: 45,
    backgroundColor: "lightgrey",
    marginLeft: 15,
    borderRadius: 10,
    justifyContent: "center",
    padding: 13,
    marginTop: 10,
  },

  descriptionContainer: {
    paddingHorizontal: windowWidth * 0.03,
  },
  descriptionText: {
    fontSize: windowWidth * 0.062,
  },
  bigView: {
    justifyContent: "center",
    padding: windowWidth * 0.05,
    // marginTop: 5,
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
    marginLeft: windowWidth * 0.032,
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
    marginLeft: windowWidth * 0.032,
    color: "black",
    fontSize: windowWidth * 0.05,
  },
  endsText: {
    fontSize: windowWidth * 0.06,
    fontWeight: "bold",
    marginTop: 2,
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
    marginLeft: windowWidth * 0.032,
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
    marginLeft: windowWidth * 0.032,
    color: "black",
    fontSize: windowWidth * 0.05,
  },

  timeView: {
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 1,
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
});

export default AddEventConfirmation;
