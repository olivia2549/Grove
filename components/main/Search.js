/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Search.js
 * User sees who friended them and searches for new friends
 */

import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Button, TouchableOpacity, Text, FlatList, StyleSheet, Image } from "react-native";
import { FancyInput } from "../styling";

import firebase from "firebase";
require('firebase/firestore');

export const Search = () => {
    const navigation = useNavigation();
    const [usersToDisplay, setUsersToDisplay] = useState([]);
    const [isFriend, setIsFriend] = useState(false);
    const [search, setSearch] = useState("");

    // Initially show all the users in the database sorted by name
    // TODO: sort users using a suggestion algorithm
    useEffect(() => {
        firebase.firestore().collection("users")
            .orderBy("name")
            .get()
            .then(snapshot => {
                let usersArr = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}  // the object to place in the users array
                });
                setUsersToDisplay(usersArr);
            });
    }, []);

    // Grab users that match a search
    useEffect(() => {
        const fetchUserToDisplay = async() => {
            const docs = await firebase.firestore()
                .collection("users")
                .orderBy("name")
                .startAt(search)
                .endAt(search + '\uf8ff')   // last letter; includes everything in search so far
                .get();

            let usersArr = [];
            docs.forEach(doc => {
                const data = doc.data();
                const id = doc.id;
                if (id === firebase.auth().currentUser.uid) {
                    return;
                }
                usersArr.push(data);
            })
            setUsersToDisplay(usersArr);
        }
        fetchUserToDisplay();
    }, [search]);

    return (
        <View style={{padding: 40}}>
            <FancyInput placeholder="Search..." onChangeText={search => {setSearch(search)}}/>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={usersToDisplay}
                renderItem={({item}) => (   // Allows you to render a text item for each user
                    <View style={styles.userCellContainer}>
                        <TouchableOpacity
                            // onPress={navigation.navigate("Profile", {uid: item.id})}
                            onPress={() => { navigation.navigate("Profile", {uid: item.ID}) }}
                        >
                            <Image
                                source={require("../../assets/profileicon.jpg")}
                                style={styles.profilePic}
                            />
                            <Text style={styles.userName}>{item.name}</Text>
                            <Button
                                title="add friend"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    userCellContainer: {
        margin: 5,
        flex: 1,
        flexDirection: "row",
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

export default Search;
