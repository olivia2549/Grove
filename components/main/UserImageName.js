/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * UserImageName.js
 * Displays a user's image and name in a row
 */

import React, { useEffect, useState } from "react";

import {
  Text,
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { fetchFromFirebase } from "../../shared/HelperFunctions";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import { fetchUserOutgoingRequests } from "../../redux/actions";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const UserImageName = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  let [isLoading, setIsLoading] = useState(true);
  let [user, setUser] = useState(null);

  const currentUser = useSelector((state) => state.currentUser);
  const currentUserID = firebase.auth().currentUser.uid;

  const friends = useSelector((state) => state.currentUser.friends);

  const outgoingRequests = useSelector(
    (state) => state.currentUser.outgoingRequests
  );

  useEffect(() => {
    fetchFromFirebase(props.id, "users").then((data) => {
      if (data.data()) {
        setUser(data.data());
        console.log(data.data());
        setIsLoading(false);
      }
    });
  }, [isLoading]);

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

  if (isLoading) return <Text>Loading...</Text>;

  if (!user) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ProfileUser", { uid: props.id });
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Image
            source={require("../../assets/profileicon.jpg")}
            style={styles.profilePic}
          />
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        {props.id === currentUser.ID && (
          <View style={styles.alreadyFriendsUntouchable}>
            <Text style={styles.alreadyFriendsText}>You</Text>
          </View>
        )}
        {friends.indexOf(props.id) > -1 && (
          <View style={styles.alreadyFriendsUntouchable}>
            <Text style={styles.alreadyFriendsText}>Friends</Text>
          </View>
        )}
        {outgoingRequests.indexOf(props.id) > -1 && (
          <View style={styles.alreadyFriendsUntouchable}>
            <Text style={styles.alreadyFriendsText}>Requested</Text>
          </View>
        )}
        {props.id !== currentUser.ID &&
          friends.indexOf(props.id) === -1 &&
          outgoingRequests.indexOf(props.id) === -1 && (
            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={() => {
                addFriend(props.id);
              }}
            >
              <Text style={styles.addFriendText}>Add Friend</Text>
            </TouchableOpacity>
          )}
      </TouchableOpacity>
      <View style={styles.underline} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flex: 1,
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 400 / 2,
  },
  userName: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: windowWidth * 0.042,
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
  underline: {
    borderBottomWidth: 1,
    width: "92.5%",
    borderBottomColor: "#E8E8E8",
    marginTop: 5,
    alignItems: "center",
    marginLeft: windowWidth * 0.028,
  },
});

export default UserImageName;
