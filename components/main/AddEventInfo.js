/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventInfo.js
 * Allows user to make a new event
 */

import React, { useState, useRef } from "react";

import {
  Button,
  Text,
  View,
  TextInput,
  Platform,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FancyButtonButLower } from "../styling";

import { useDispatch, useSelector } from "react-redux";
import {
  addEventDescription,
  addEventLocation,
  addEventName,
} from "../../redux/actions";

import { AddEventTags } from "./AddEventTags";
import { useNavigation } from "@react-navigation/native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyBoardAvoid: {
    // justifyContent: "center",
    // flex: 1,
    marginTop: windowHeight * 0.25,
  },

  textInput: {
    fontSize: windowWidth * 0.08,
    marginLeft: windowWidth * 0.05,
    marginBottom: 20,
    marginTop: windowHeight * 0.012,
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

  // name, description, and location
  textBox: {
    // width: windowWidth * 0.5,
    // height: windowHeight * 0.03,
    // backgroundColor: "#5DB075",
    marginLeft: windowWidth * 0.05,
    borderRadius: 10,
    justifyContent: "flex-start",
  },
  textBoxText: {
    color: "#5DB075",
    marginLeft: windowWidth * 0.022,
    fontSize: windowWidth * 0.047,
  },
  underline: {
    borderBottomWidth: 1,
    width: windowWidth * 0.7,
    borderBottomColor: "#5DB075",
    marginLeft: windowWidth * 0.05,
  },
});

export const AddEventInfo = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.currentUser);

  const [name, setName] = useState("");
  const nameRef = useRef(null);

  const [description, setDescription] = useState("");
  const descriptionRef = useRef(null);

  const [location, setLocation] = useState("");
  const locationRef = useRef(null);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>Create Event</Text>
      </View>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyBoardAvoid}
        >
          {/* NAME */}
          <View style={styles.textBox}>
            <Text style={styles.textBoxText}>Name</Text>
          </View>
          <View style={styles.underline} />
          <TextInput
            id="nameInput"
            name="nameInput"
            placeholder="Name..."
            ref={nameRef}
            onChangeText={(text) => {
              setName(text);
            }}
            returnKeyType="next"
            autoFocus={true}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              if (name === "") {
                Alert.alert("Please add a name for this event.");
                nameRef.current.focus();
              } else {
                descriptionRef.current.focus();
                dispatch(addEventName(name));
              }
            }}
            defaultValue={name}
            selectTextOnFocus={true}
            style={styles.textInput}
          />

          {/* LOCATION */}
          <View style={styles.textBox}>
            <Text style={styles.textBoxText}>Location</Text>
          </View>
          <View style={styles.underline} />

          <TextInput
            id="locationInput"
            name="locationInput"
            placeholder="Location..."
            ref={locationRef}
            blurOnSubmit={false}
            onChangeText={(text) => {
              setLocation(text);
            }}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (location === "") {
                Alert.alert("Please add a location for this event.");
                locationRef.current.focus();
              } else {
                dispatch(addEventLocation(location));
                navigation.navigate("AddEventTags");
              }
            }}
            selectTextOnFocus={true}
            value={location}
            style={styles.textInput}
          />
          {/* DESCRIPTION */}
          <View style={styles.textBox}>
            <Text style={styles.textBoxText}>Description</Text>
          </View>
          <View style={styles.underline} />

          <TextInput
            id="descriptionInput"
            name="descriptionInput"
            placeholder="Description..."
            ref={descriptionRef}
            onChangeText={(text) => {
              setDescription(text);
            }}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              if (description === "") {
                Alert.alert("Please add a description for this event.");
                descriptionRef.current.focus();
              } else {
                locationRef.current.focus();
                dispatch(addEventDescription(description));
              }
            }}
            selectTextOnFocus={true}
            value={description}
            multiline={true}
            allowFontScaling={true}
            style={styles.textInput}
          />
        </KeyboardAvoidingView>
      </View>
      <View style={{ bottom: windowWidth * 0.1 }}>
        <FancyButtonButLower
          title="Next"
          onPress={() => {
            navigation.navigate("AddEventTags");
          }}
        />
      </View>
    </View>
  );
};

export default AddEventInfo;
