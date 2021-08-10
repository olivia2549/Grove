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
  Platform, TouchableOpacity, FlatList,
} from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { InviteFriends } from "./InviteFriends";

import {FancyButtonButLower, FancyInput} from "../styling";
import {parseDate, getMonthName, getWeekDay } from "../../shared/HelperFunctions";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from "firebase";
import GestureRecognizer from "react-native-swipe-gestures";
import {Tooltip} from "react-native-elements";
import UserImageName from "./UserImageName";
import RBSheet from "react-native-raw-bottom-sheet";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const AddEventConfirmation = () => {
  const navigation = useNavigation();

  const currentUserID = firebase.auth().currentUser.uid;
  const currentUserRef = firebase.firestore().collection("users").doc(currentUserID);

  // Grabs event data from redux, stores as an object
  const eventData = {
    name: useSelector((state) => state.event.name),
    nameLowercase: useSelector(state => state.event.nameLowercase),
    description: useSelector((state) => state.event.description),
    tags: useSelector((state) => state.event.tags),
    startDateTime: useSelector((state) => state.event.startDateTime),
    endDateTime: useSelector((state) => state.event.endDateTime),
    location: useSelector((state) => state.event.location),
    attendees: useSelector(state => state.event.attendees),
    creator: currentUserRef,
  };

  const start = parseDate(eventData.startDateTime);
  const end = parseDate(eventData.endDateTime);

  // New event gets added to firebase
  const onSubmit = () => {
    const docRef = firebase.firestore().collection("events").doc();
    eventData.ID = docRef.id;
    docRef.set(eventData)
        .then(() => {
          console.log("Posted to firebase - " + eventData.ID);
          Alert.alert("Event posted");
          navigation.navigate("EventDetails", {ID: eventData.ID});
        })
        .catch((error) => {
          console.log("Error posting to firebase - " + error);
          Alert.alert("Error posting to firebase");
        });
  }

  return (
      <View style={styles.container}>
        {/*Top bar*/}
        <View
            style={styles.topBarContainer}
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
            </View>
            <View style={styles.eventNameContainer}>
              <Text adjustsFontSizeToFit style={styles.eventNameText}>
                {eventData.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.eventInfoContainer}>
          <View style={styles.infoContainers}>
            {eventData.tags.map((tag) => (
                <View style={styles.eachTag} key={tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
            ))}
          </View>
          <View style={styles.infoContainers}>
            <Text style={styles.descriptionText}>
              {eventData.description}
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
              <View style={styles.whereWhenTitlesContainer}>
                <Text style={styles.whereWhenTitles}>Ends</Text>
              </View>
            </View>
            <View style={styles.whereWhenContainer}>
              <View style={styles.locationRowContainer}>
                <View style={styles.locationView}>
                  <Text style={styles.locationText}>
                    {eventData.location}
                  </Text>
                </View>
              </View>
              <View style={styles.locationRowContainer}>
                <View style={styles.dateView}>
                  <Text style={styles.locationText}>
                    {start.month.substr(0,3)} {start.date}
                  </Text>
                </View>
                <View style={styles.timeView}>
                  <Text style={styles.locationText}>
                    {start.ampmTime}
                  </Text>
                </View>
              </View>
              <View style={styles.locationRowContainer}>
                <View style={styles.dateView}>
                  <Text style={styles.locationText}>
                    {end.month.substr(0,3)} {end.date}
                  </Text>
                </View>
                <View style={styles.timeView}>
                  <Text style={styles.locationText}>
                    {end.ampmTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ bottom: windowWidth * 0.1 }}>
          <FancyButtonButLower title="Post Event" onPress={() => onSubmit()}/>
        </View>
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
    width: windowWidth * 0.7,
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
    height: 50,
    marginBottom: 5,
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
});

export default AddEventConfirmation;
