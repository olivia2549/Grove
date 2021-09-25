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
  TextInput, Keyboard, TouchableWithoutFeedback, SafeAreaView
} from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase";

import Main from "../Main";
import { FancyButtonButLower, FancyInput } from "../styling";
import { AddEventConfirmation } from "./AddEventConfirmation";

import {fetchFromFirebase} from "../../shared/HelperFunctions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import UserImageName from "./UserImageName";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const InviteFriends = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [usersToDisplay, setUsersToDisplay] = useState([]);

    const [friendsToInvite, setFriendsToInvite] = useState([]);

    const [fancyBtnText, setFancyBtnText] = useState("Open To All");

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
                    if (id === firebase.auth().currentUser.uid) return;
                    if (friendsToInvite.indexOf(id) !== -1) return;
                    usersArr.push(data); // the object to place in the users array
                })
                setUsersToDisplay(usersArr);
                setIsLoading(false);
            });
    }, [isLoading, friendsToInvite]);

    const invite = (id) => {
        setFancyBtnText("Next");
        setFriendsToInvite(friendsToInvite => [...friendsToInvite, id]);
    };

    return (
      <View style={styles.container}>
        {/*Top bar*/}
        <View
            style={styles.topBarContainer}
        >
          <View style={styles.topBar}>
            <View style={styles.topBarButtons}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons
                    name="chevron-down"
                    color={"white"}
                    size={35}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.eventNameContainer}>
              <Text adjustsFontSizeToFit style={styles.eventNameText}>Private Event?</Text>
            </View>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <View style={{ padding: 20 }}>
                    <FancyInput
                        placeholder="Search..."
                        onChangeText={(search) => {
                            const searchLower = search.toLowerCase();
                            setSearch(searchLower);
                            setIsLoading(true);
                        }}
                        returnKeyType="search"
                    />
                </View>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={usersToDisplay}
                    keyExtractor={(item, index) => item.ID}
                    style={{ marginTop: windowHeight * 0.03 }}
                    renderItem={(
                        { item } // Allows you to render a text item for each user
                    ) => (
                        <View style={styles.userCellContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ProfileUser", { uid: item.ID });
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                    }}
                                >
                                    <Image
                                        source={require("../../assets/profileicon.jpg")}
                                        style={styles.profilePic}
                                    />
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={styles.userName}>{item.name}</Text>
                                    </View>
                                </View>

                                {/* <View style={{ flexDirection: "row" }}> */}
                                <TouchableOpacity
                                    style={styles.acceptRequestContainer}
                                    onPress={() => {
                                        invite(item.ID);
                                    }}
                                >
                                    <Text style={styles.acceptRequestContainerText}>
                                        Invite
                                    </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>

                            <View style={styles.underline} />
                        </View>
                    )}
                />
            </View>
        </TouchableWithoutFeedback>
          <FancyButtonButLower
              onPress={() => navigation.navigate("AddEventConfirmation", {friendsToInvite})}
              title={fancyBtnText}
          />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  topBarContainer: {
    backgroundColor: "#5db075",
    flexDirection: "column-reverse",
    justifyContent: "space-around",
    height: windowHeight*0.22,
  },
  topBar: {
    flexDirection: "column",
    justifyContent: "center",
    margin: 10,
    marginTop: 20,
  },
  topBarButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventNameContainer: {
    alignContent: "flex-end",
  },
  eventNameText: {
    color: "white",
    fontWeight: "500",
    fontSize: 36,
    textAlign: "center",
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
        fontSize: windowWidth * 0.04,
    },
    acceptRequestContainer: {
        justifyContent: "center",
        padding: 11,
        height: 40,
        backgroundColor: "#5DB075",
        borderRadius: 10,
        position: "absolute",
        right: 10,
    },
    acceptRequestContainerText: {
        textAlign: "center",
        color: "white",
        fontWeight: "600",
    },
    userCellContainer: {
        margin: 5,
        flex: 1,
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

export default InviteFriends;
