/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Search.js
 * Allows for Search functionality
 */

import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, FlatList } from "react-native";
import { FancyInput } from "../styling";

import firebase from "firebase";
require('firebase/firestore');

export const Search = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);

    /**
     * fetchUsers
     *
     * Grab users that match a search
     * @param search - user input
     */
    const fetchUsers = (search) => {
        if (search.length != 0) {
            firebase.firestore()
                .collection("users")
                .orderBy('name')
                .startAt(search)
                .endAt(search + '\uf8ff')
                // .where('name', '>=', search) // username == search, or has search contents plus more chars
                .get()
                .then((snapshot) => {
                    let usersArr = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }  // the object to place in the users array
                    });
                    setUsers(usersArr);
                })
            }
        // else {
        //     suggestUsers
        // }
    }

    // const suggestUsers = () => {
    // }

    return (
        <View style={{padding: 40}}>
            <FancyInput placeholder="Search..." onChangeText={(search) => {fetchUsers(search)}}/>

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (   // Allows you to render a text item for each user
                    <Text onPress={() => {navigation.navigate("Profile", {uid: item.id})}}>{item.name}</Text>
                )}
            />
        </View>
    );
}

export default Search;
