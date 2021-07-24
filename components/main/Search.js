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
import {useDispatch, useSelector} from "react-redux";
import {fetchUserOutgoingRequests} from "../../redux/actions";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Search = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentUserID = useSelector(state => state.currentUser.ID);

  const [search, setSearch] = useState("");
  const [usersToDisplay, setUsersToDisplay] = useState([]);

  const friends = useSelector(state => state.currentUser.friends);

  const outgoingRequests = useSelector(state => state.currentUser.outgoingRequests);

  useEffect(() => {
    // Initially show all the users in the database sorted by name
    // TODO: sort users using a suggestion algorithm
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

    // Fetch outgoingRequests
    dispatch(fetchUserOutgoingRequests());
  }, []);

  // Grab users that match a search
  useEffect(() => {
    const fetchUserToDisplay = async () => {
      const docs = await firebase
          .firestore()
          .collection("users")
          .orderBy("nameLowercase")
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

  //returns events user searched for
  //   const searchEvents = (search) => {
  //         search = search.toLowerCase();
  //         firebase.firestore()
  //             .collection("events")
  //             .orderBy('nameLowercase')
  //             .startAt(search)
  //             .endAt(search + '\uf8ff')
  //             // .where('name', '>=', search) // username == search, or has search contents plus more chars
  //             .get()
  //             .then((snapshot) => {
  //                 let eventsArr = snapshot.docs.map(doc => {
  //                     const data = doc.data();
  //                     const id = doc.id;
  //                     return {id, ...data}  // the object to place in the users array
  //                 });
  //                 setEvents(eventsArr);
  //             })
  // }

  // Adds a friend
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
                }}
                returnKeyType="search"
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
                          navigation.navigate("ProfileUser", { uid: item.ID });
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
                      {
                        friends.indexOf(item.ID) > -1 &&
                        <View style={styles.alreadyFriendsUntouchable}>
                          <Text style={styles.alreadyFriendsText}>Friends</Text>
                        </View>
                      }
                      {
                        outgoingRequests.indexOf(item.ID) > -1 &&
                        <View style={styles.alreadyFriendsUntouchable}>
                          <Text style={styles.alreadyFriendsText}>Requested</Text>
                        </View>
                      }
                      { friends.indexOf(item.ID) === -1 && outgoingRequests.indexOf(item.ID) === -1 &&
                      <TouchableOpacity style={styles.addFriendButton} onPress={() => {addFriend(item.ID)}}>
                        <Text style={styles.addFriendText}>Add Friend</Text>
                      </TouchableOpacity>
                      }
                      {/* <Button style={{ borderRadius: 20 }} title="add friend" /> */}
                    </TouchableOpacity>
                    <View style={styles.underline} />
                  </View>
              )}
          />
        </View>
      </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
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
  alreadyFriendsUntouchable: {
    justifyContent: "flex-end",
    padding: 11,
    height: windowHeight * 0.04,
    backgroundColor: "lightgray",
    borderRadius: 10,
  },
  alreadyFriendsText: {
    textAlign: "center",
    color: "black",
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
