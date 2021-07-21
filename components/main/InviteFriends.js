/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * InviteFriends.js
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
  FlatList, Image, Button, Share,
    TextInput
} from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase";

import Main from "../Main";
import { FancyButtonButLower, FancyInput } from "../styling";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const InviteFriends = ( { route } ) => {
  const navigation = useNavigation();

  const friends = useSelector(state => state.currentUser.friends);
  const [friendsToDisplay, setFriendsToDisplay] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [search, setSearch] = useState("");

  const eventName = route.params.name;
  const userName = useSelector(state => state.currentUser.name);

  // Get the user data for each friend to display
  useEffect(() => {
    const fetchFriends = async () => {
      const docs = await firebase.firestore().collection("users")
          .orderBy("name")
          .startAt(search)
          .endAt(search + "\uf8ff") // last letter; includes everything in search so far
          .get();

      let friendsArr = [];
      docs.forEach(doc => {
        const id = doc.id;
        if (friends.indexOf(id) > -1) friendsArr.push(doc.data());
      });
      setFriendsToDisplay(friendsArr);
    }
    fetchFriends();
  }, [search]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
            `${userName} is inviting you to ${eventName}. Check it out on Grove! *link*`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>Invite Friends</Text>
      </View>

      <View style={styles.content}>
        <View style={{ paddingHorizontal: 10 }}>
          <TextInput
            placeholder="Search..."
            returnKeyType="search"
            onChangeText={search => {setSearch(search)}}
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

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <FancyButtonButLower title="share" onPress={onShare} />
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

export default InviteFriends;
