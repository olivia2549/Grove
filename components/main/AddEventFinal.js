/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventFinal.js
 * User posts event
 */

import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList, Image, Button,
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
  const friends = useSelector(state => state.currentUser.friends);
  const [friendsToDisplay, setFriendsToDisplay] = useState([]);
  const [allFriends, setAllFriends] = useState([]);

  // Get the user data for each friend to display
  useEffect(() => {
    const fetchFriends = async () => {
      const docs = await firebase.firestore().collection("users").get();

      let friendsArr = [];
      docs.forEach(doc => {
        const id = doc.id;
        if (friends.indexOf(id) > -1) friendsArr.push(doc.data());
      });
      setFriendsToDisplay(friendsArr);
    }
    fetchFriends();
  }, [friends]);

  const fetchFriends = (search) => {
    if (search.length !== 0) {
      friends.forEach(friend => {
        firebase.firestore().collection("users")
            .doc(friend)
            .orderBy("name")
            .startAt(search)
            .endAt(search + '\uf8ff')   // last letter; includes everything in search so far
            .get()
            .then((snapshot) => {
              let friendsArr = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id, ...data}  // the object to place in the users array
              });
              setFriendsToDisplay(friendsArr);
            })
      })
    }
    else setFriendsToDisplay(allFriends);
  }

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
              fetchFriends(search)
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
            data={friendsToDisplay}
            renderItem={({item}) => (   // Allows you to render a text item for each user
                <View style={styles.userCellContainer}>
                  <TouchableOpacity
                      onPress={() => {
                        // TODO: invite the friend
                      }}
                  >
                    <Image
                        source={require("../../assets/profileicon.jpg")}
                        style={styles.profilePic}
                    />
                    <Text style={styles.userName}>{item.name}</Text>
                    <Button
                        title="invite friend"
                    />
                  </TouchableOpacity>
                </View>
            )}
        />
      </View>

      <View style={{ bottom: windowWidth * 0.1 }}>
        <FancyButtonButLower title="Done" onPress={() => navigation.navigate("Main")} />
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
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 400 / 2,
  },
  userName: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 5,
  },
});

export default AddEventFinal;
