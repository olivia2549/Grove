/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventInfo.js
 * User adds new event name, description, and location
 */

import React, { useState, useRef } from "react";

import {
  Text,
  View,
  TextInput,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { FancyButtonButLower } from "../styling";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  addEventDescription,
  addEventLocation,
  addEventName,
} from "../../redux/actions";

import { AddEventTags } from "./AddEventTags";

import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const AddEventInfo = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const nameRef = useRef(null);

  const [description, setDescription] = useState("");
  const descriptionRef = useRef(null);

  const [location, setLocation] = useState("");
  const locationRef = useRef(null);

  const onSubmit = () => {
    if (name.length === 0) {
      Alert.alert("Name is required");
      return;
    }
    if (description.length === 0) {
      Alert.alert("Description is required");
      return;
    }
    if (location.length === 0) {
      Alert.alert("Location is required");
      return;
    }
    dispatch(addEventName(name));
    dispatch(addEventLocation(location));
    dispatch(addEventDescription(description));
    navigation.navigate("AddEventTags");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons style={{top: "50%"}} name="chevron-down" color={"white"} size={35}/>
        </TouchableOpacity>
        <Text style={styles.titleText}>Create Event</Text>
      </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyBoardAvoid}
          enabled
          keyboardVerticalOffset={200}
        >
          {/* NAME */}
          <View style={styles.textBox}>
            <Text style={styles.textBoxText}>Event Name</Text>
          </View>
          <View style={styles.underline} />
          <TextInput
            id="nameInput"
            name="nameInput"
            placeholder="Event Name..."
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
              } else if (name.length > 25) {
                Alert.alert("Please make your title under 25 characters");
                nameRef.current.focus();
              } else {
                console.log(name.length);
                locationRef.current.focus();
              }
            }}
            defaultValue={name}
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
            returnKeyType="next"
            onSubmitEditing={() => {
              if (location === "") {
                Alert.alert("Please add a location for this event.");
                locationRef.current.focus();
              } else {
                descriptionRef.current.focus();
              }
            }}
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
              returnKeyType="done"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (description === "") {
                  Alert.alert("Please add a description for this event.");
                  descriptionRef.current.focus();
                } else {
                  onSubmit();
                }
              }}
              value={description}
              multiline={true}
              allowFontScaling={true}
              style={styles.textInputDescription}
            />
        </KeyboardAvoidingView>
      <View style={{ bottom: windowWidth * 0.1 }}>
        <FancyButtonButLower
          title="Next"
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
  keyBoardAvoid: {
    flex: 1,
    marginTop: windowHeight * 0.25,
  },
  textInput: {
    fontSize: windowWidth * 0.08,
    marginLeft: windowWidth * 0.05,
    marginBottom: 20,
    marginTop: windowHeight * 0.012,
  },
  textInputDescription: {
    fontSize: windowWidth * 0.04,
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
    top: "15%",
    padding: 25,
    fontSize: windowWidth * 0.12,
  },
  textBox: {
    // name, description, and location styling
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

export default AddEventInfo;
