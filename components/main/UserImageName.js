/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * UserImageName.js
 * Displays a user's image and name in a row
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { fetchFromFirebase } from "../../shared/HelperFunctions";

import { fetchUserOutgoingRequests } from "../../redux/actions";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const UserImageName = ({ id }) => {
  const dispatch = useDispatch();

  let [isLoading, setIsLoading] = useState(true);
  let [user, setUser] = useState(null);

  const friends = useSelector((state) => state.currentUser.friends);

  const outgoingRequests = useSelector(
    (state) => state.currentUser.outgoingRequests
  );

  useEffect(() => {
    fetchFromFirebase(id, "users").then((data) => {
      if (data.data()) {
        setUser(data.data());
        console.log(data.data());
      }
      setIsLoading(false);
    });

    // Fetch outgoingRequests
    dispatch(fetchUserOutgoingRequests());
  }, [isLoading]);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View style={styles.profileContainer}>
      <Image
        source={require("../../assets/profileicon.jpg")}
        style={styles.profilePic}
      />
      <Text style={styles.userName}>{user?.name}</Text>
      {friends.indexOf(id) > -1 && (
        <View style={styles.alreadyFriendsUntouchable}>
          <Text style={styles.alreadyFriendsText}>Friends</Text>
        </View>
      )}
      {outgoingRequests.indexOf(id) > -1 && (
        <View style={styles.alreadyFriendsUntouchable}>
          <Text style={styles.alreadyFriendsText}>Requested</Text>
        </View>
      )}
      {friends.indexOf(id) === -1 && outgoingRequests.indexOf(id) === -1 && (
        <TouchableOpacity
          style={styles.addFriendButton}
          onPress={() => {
            addFriend(id);
          }}
        >
          <Text style={styles.addFriendText}>Add Friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
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
    fontWeight: "bold",
    fontSize: windowWidth * 0.043,
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
    height: 33,
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
    height: 33,
    backgroundColor: "lightgray",
    borderRadius: 10,
    position: "absolute",
    right: 10,
  },
  alreadyFriendsText: {
    textAlign: "center",
    color: "black",
  },
});

export default UserImageName;
