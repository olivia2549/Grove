/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Search.js
 * User sees who friended them and searches for new friends
 */

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Button,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard, SafeAreaView,
} from "react-native";
import { SearchPeople } from "./SearchPeople";
import { SearchEvents } from "./SearchEvents";

import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOutgoingRequests } from "../../redux/actions";
import UserImageName from "./UserImageName";
import {setCurrentScreen, setDebugModeEnabled} from "expo-firebase-analytics";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Search = () => {
  const dispatch = useDispatch();
  setDebugModeEnabled(true);
  setCurrentScreen("Search");

  const [loadingPeople, setLoadingPeople] = useState(false);

  useEffect(() => {
    // Fetch outgoingRequests
    dispatch(fetchUserOutgoingRequests());
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={{alignItems: "center"}}>
          <Text style={{ fontSize: 32, fontWeight: "bold", top: 7 }}>Search</Text>
        </View>
        <SearchPeople loading={loadingPeople}/>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "white"
  },
  profileComponentWithoutBorderline: {
    flexDirection: "row",
    marginTop: 5,
    flex: 1,
    paddingHorizontal: 13,
  },
  addFriendButton: {
    justifyContent: "center",
    padding: 11,
    height: 40,
    backgroundColor: "#5DB075",
    borderRadius: 10,
    position: "absolute",
    right: 10,
  },
  addFriendText: {
    textAlign: "center",
    color: "white",
  },
  alreadyFriendsUntouchable: {
    justifyContent: "center",
    padding: 11,
    height: 40,
    backgroundColor: "lightgray",
    borderRadius: 10,
    position: "absolute",
    right: 10,
  },
  alreadyFriendsText: {
    textAlign: "center",
    color: "black",
  },
  userCellContainer: {
    margin: 5,
    flex: 1,
    // paddingHorizontal: 10,
  },
  profilePic: {
    width: 45,

    height: 45,
    borderRadius: 400 / 2,
  },
  userName: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
    // marginTop: 10,
    fontWeight: "bold",
    fontSize: windowWidth * 0.0412,
    // fontSize:17 ,
  },
  underline: {
    borderBottomWidth: 1,
    width: "92.5%",
    borderBottomColor: "#E8E8E8",
    marginTop: 5,
    alignItems: "center",
    marginLeft: windowWidth * 0.028,
  },
});

export default Search;
