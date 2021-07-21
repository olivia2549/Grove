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
} from "react-native";
import { FancyInput } from "../styling";

import firebase from "firebase";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Search = () => {
  const navigation = useNavigation();
  const [usersToDisplay, setUsersToDisplay] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [search, setSearch] = useState("");

  // Initially show all the users in the database sorted by name
  // TODO: sort users using a suggestion algorithm
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .orderBy("name")
      .get()
      .then((snapshot) => {
        let usersArr = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data }; // the object to place in the users array
        });
        setUsersToDisplay(usersArr);
      });
  }, []);

  // Grab users that match a search
  useEffect(() => {
    const fetchUserToDisplay = async () => {
      const docs = await firebase
        .firestore()
        .collection("users")
        .orderBy("name")
        .startAt(search)
        .endAt(search + "\uf8ff") // last letter; includes everything in search so far
        .get();

      let usersArr = [];
      docs.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        if (id === firebase.auth().currentUser.uid) {
          return;
        }
        usersArr.push(data);
      });
      setUsersToDisplay(usersArr);
    };
    fetchUserToDisplay();
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>Add Friends</Text>
      </View>

      <View style={{ padding: 20 }}>
        <FancyInput
          placeholder="Search..."
          onChangeText={(search) => {
            setSearch(search);
          }}
        />
      </View>

      <FlatList
        numColumns={1}
        horizontal={false}
        data={usersToDisplay}
        renderItem={(
          { item } // Allows you to render a text item for each user
        ) => (
          <View style={styles.userCellContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Profile", { uid: item.ID });
              }}
              style={{
                flexDirection: "row",
                marginTop: 5,
                flex: 1,
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                <Image
                  source={require("../../assets/profileicon.jpg")}
                  style={styles.profilePic}
                />
                <Text style={styles.userName}>{item.name}</Text>
              </View>
              <TouchableOpacity style={styles.addFriendButton}>
                <Text style={styles.addFriendText}>Add Friend</Text>
              </TouchableOpacity>
              {/* <Button style={{ borderRadius: 20 }} title="add friend" /> */}
            </TouchableOpacity>

            <View style={styles.underline} />
          </View>
        )}
      />
    </View>
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

  addFriendButton: {
    justifyContent: "flex-end",
    padding: 11,
    height: windowHeight * 0.04,
    backgroundColor: "#5DB075",
    borderRadius: 10,
  },
  addFriendText: {
    textAlign: "center",
    color: "white",
  },

  userCellContainer: {
    margin: 5,
    flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
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

  underline: {
    borderBottomWidth: 1,
    width: "92%",
    borderBottomColor: "#E8E8E8",
    marginTop: 5,
    alignItems: "center",
    marginLeft: windowWidth * 0.022,
  },
});

export default Search;
