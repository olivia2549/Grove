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
  Keyboard,
} from "react-native";
import { FancyInput } from "../styling";
import { ProfileUser } from "./ProfileUser";

import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOutgoingRequests } from "../../redux/actions";
import UserImageName from "./UserImageName";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Search = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [usersToDisplay, setUsersToDisplay] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);

  useEffect(() => {
    // Fetch outgoingRequests
    dispatch(fetchUserOutgoingRequests());
  }, []);

  useEffect(() => {
    // Initially show all the users in the database sorted by name
    // TODO: sort users using a suggestion algorithm
    firebase
      .firestore()
      .collection("users")
      .orderBy("nameLowercase")
        .startAt(search)
        .endAt(search + "\uf8ff")
      .get()
      .then((snapshot) => {
        let usersArr = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          if (id === firebase.auth().currentUser.uid) {
            return;
          }
          usersArr.push(data); // the object to place in the users array
        })
        setUsersToDisplay(usersArr);
        setIsLoading(false);
        setIsLoadingSearch(false);
      });
    }, [isLoading, isLoadingSearch]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Add Friends</Text>
        </View>

        <View style={{ padding: 20 }}>
          <FancyInput
            placeholder="Search..."
            onChangeText={(search) => {
              const searchLower = search.toLowerCase();
              setSearch(searchLower);
              setIsLoadingSearch(true);
            }}
            returnKeyType="search"
          />
        </View>

        <FlatList
          numColumns={1}
          horizontal={false}
          data={usersToDisplay}
          keyExtractor={(item, index) => item.ID}
          renderItem={(
            { item } // Allows you to render a text item for each user
          ) => (
              <UserImageName id={item.ID}/>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  titleBox: {
    height: "25%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  titleText: {
    textAlign: "center",
    fontSize: windowWidth * 0.088,
    color: "black",
    fontWeight: "700",
    marginTop: windowHeight * 0.05,
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
