/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventFinal.js
 * User posts event
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
} from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase";

import Main from "../Main";
import { FancyButtonButLower, FancyInput } from "../styling";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const AddEventFinal = () => {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);

  var eventData = {
    name: useSelector(state => state.event.name),
    description: useSelector(state => state.event.description),
    tags: useSelector(state => state.event.tags),
    startDateTime: useSelector(state => state.event.startDateTime),
    endDateTime: useSelector(state => state.event.endDateTime),
    location: useSelector(state => state.event.location),
    attendees: [],
  };

  // Grab users that match a search
  const fetchUsers = (search) => {
    if (search.length !== 0) {
      firebase
          .firestore()
          .collection("users")
          .orderBy("name")
          .startAt(search)
          .endAt(search + "\uf8ff")
          // .where('name', '>=', search) // username == search, or has search contents plus more chars
          .get()
          .then((snapshot) => {
            let usersArr = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return {id, ...data}; // the object to place in the users array
            });
            setUsers(usersArr);
          });
    }
  }

  // New event gets added to firebase
  const onPress = async () => {
    const docRef = await firebase.firestore().collection("events").doc();
    eventData.ID = docRef.id;
    eventData.creator = await firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid);
    eventData.attendees.push(eventData.creator);
    eventData.nameLowercase = eventData.name.toLowerCase();
    await docRef.set(eventData);
    console.log("Posted to firebase - " + eventData.ID);
    navigation.navigate("Main");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>Invite Friends</Text>
      </View>

      <View style={styles.content}>
        <View style={{ paddingHorizontal: 10 }}>
          <FancyInput
            placeholder="Search..."
            onChangeText={(search) => {
              fetchUsers(search);
            }}
          />
        </View>

        <View style={{ paddingHorizontal: 10 }}>
          <Text style={{ fontSize: windowWidth * 0.07, fontWeight: "bold" }}>
            Suggested
          </Text>
        </View>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={users}
          renderItem={(
            { item } // Allows you to render a text item for each user
          ) => (
            <Text
              onPress={() => {
                navigation.navigate("Profile", { uid: item.id });
              }}
            >
              {item.name}
            </Text>
          )}
        />
      </View>

      <View style={{ bottom: windowWidth * 0.1 }}>
        <FancyButtonButLower title="Post Event" onPress={onPress} />
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
});

export default AddEventFinal;
