/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Profile.js
 * Create/edit user profile
 */

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { clearData } from "../../redux/actions";

import firebase from "firebase";
import ProfileFollowing from "./ProfileFollowing";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Profile = ( {route} ) => {
  const dispatch = useDispatch();

  const userDisplayingID = route.params.uid;  // user to display
  const userDisplayingRef = firebase.firestore().collection("users").doc(userDisplayingID);
  const [userDisplaying, setUserDisplaying] = useState({});

  useEffect(() => {
    // Grabs the user to display
    firebase.firestore().collection("users").doc(userDisplayingID).get().then(doc => {
      setUserDisplaying(doc.data());
    });
  },[]);

  const currentUserID = useSelector((state) => state.currentUser.ID);
  const currentUserRef = firebase.firestore().collection("users").doc(currentUserID);

  const signOut = () => {
    firebase.auth().signOut();
    dispatch(clearData());
  };

  // Adds a friend
  const addFriend = () => {
    // add searched person to the current user's friends list
    firebase.firestore().collection("users")
        .doc(currentUserID)
        .update({
          friends: firebase.firestore.FieldValue.arrayUnion(userDisplayingRef)
        });
    // add current user to the searched person's friend list
    firebase.firestore().collection("users")
        .doc(userDisplayingID)
        .update({
          friends: firebase.firestore.FieldValue.arrayUnion(currentUserRef)
        });
  };

  // const checkFriends = () => {
  //   // Figures out if one user is friends with another
  //   console.log("user inside: ", userDisplaying);
  //   const friendList = userDisplaying.friends;
  //   if (friendList.length === 0) return false;
  //   friendList.forEach(friend => {
  //     if (friend.data().ID === currentUserID) {
  //       console.log("friend found");
  //       return true;
  //     }
  //   })
  //   return false;
  // }

  // if the current user is friends with the person they searched, show ProfileFollowing component
  // if (checkFriends()) {
  //   console.log("rendering profile following...");
  //   return <ProfileFollowing user={userDisplaying}/>
  // }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.userNameContainer}>
        <Text style={styles.userNameText}>{userDisplaying.name}</Text>
      </View>

      <View style={styles.profileBackground}>
        <Image
          source={require("../../assets/profileicon.jpg")}
          style={styles.profilePic}
        />
      </View>

      <View style={styles.infoView}>
        <View style={styles.containerInfo}>
          <Text style={styles.userEmail}>{userDisplaying.email}</Text>
        </View>
        <TouchableOpacity
          onPress={addFriend}
          style={styles.addFriend}
        >
          <Text style={styles.addFriendText}>Add Friend</Text>
        </TouchableOpacity>
        <View style={styles.lockContainer}>
          <Image
            source={require("../../assets/lock_outline.png")}
            style={styles.lockIcon}
          />
          <Text style={styles.lockIconText}>
            Follow this account to see their events
          </Text>
        </View>
        <View style={styles.containerGallery}>
          <FlatList
            numColumns={3}
            horizontal={false}
            // data={userPosts}
            renderItem={({ item }) => (
              <View style={styles.containerImage}>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </View>
            )}
          />
        </View>
      </View>

      <TouchableOpacity onPress={signOut} style={styles.signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  // view
  infoView: {
    flex: Platform.OS === "ios" ? 5 : 6,
    backgroundColor: "white",
  },
  // user's name
  userNameContainer: {
    flex: 2,
    backgroundColor: "#5DB075",
    justifyContent: "center",
  },
  userNameText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: windowWidth * 0.084,
    color: "white",
    marginBottom: Platform.OS === "ios" ? 0 : 30,
  },
  // profile pic
  profileBackground: {
    width: 110,
    height: 110,
    borderRadius: 200,
    justifyContent: "center",
    marginLeft: 15,
    marginTop: -55,
    backgroundColor: "white",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 400 / 2,
    marginLeft: 5,
    marginBottom: 0,
  },
  // user info
  userEmail: {
    marginLeft: 20,
    fontSize: windowWidth * 0.045,
    fontWeight: "400",
  },
  // add friend
  addFriend: {
    flex: 1 / 8,
    marginHorizontal: windowWidth * 0.028,
    marginTop: 8,
    height: "7%",
    backgroundColor: "#5DB075",
    borderRadius: 10,
    justifyContent: "center",
  },
  addFriendText: {
    textAlign: "center",
    color: "white",
    fontSize: windowWidth * 0.04,
  },
  // locked
  lockContainer: {
    marginTop: 25,
    flexDirection: "row",
  },
  lockIcon: {
    justifyContent: "center",
    marginLeft: 20,
    width: windowWidth * 0.058,
    height: windowHeight * 0.037,
  },
  lockIconText: {
    color: "#666666",
    fontSize: windowWidth * 0.042,
    marginLeft: 10,
    marginTop: 2,
  },
  //sign out
  signOut: {
    flex: 1 / 3,
    marginHorizontal: 12,
    marginLeft: 18,
    marginBottom: 6,
    backgroundColor: "#5DB075",
    borderRadius: 20,
    justifyContent: "center",
  },
  signOutText: {
    textAlign: "center",
    color: "white",
    fontSize: windowWidth * 0.031,
  },
});

export default Profile;
