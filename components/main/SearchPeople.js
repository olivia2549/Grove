/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * SearchPeople.js
 * User sees who friended them and searches for new friends
 */

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {
    FlatList,
    SafeAreaView,
    View,
    StyleSheet,
} from "react-native";
import {FancyInput} from "../styling";
import UserImageName from "./UserImageName";
import {fetchUserOutgoingRequests} from "../../redux/actions";
import firebase from "firebase";
import {useDispatch} from "react-redux";

export const SearchPeople = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [usersToDisplay, setUsersToDisplay] = useState([]);

    useEffect(() => {
        // Fetch outgoingRequests
        dispatch(fetchUserOutgoingRequests());
    }, []);

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
                    if (id === firebase.auth().currentUser.uid) {
                        return;
                    }
                    usersArr.push(data); // the object to place in the users array
                })
                setUsersToDisplay(usersArr);
                setIsLoading(false);
            });
    }, [props.loading, isLoading]);

    return (
        <View style={styles.container}>
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
                renderItem={(
                    { item } // Allows you to render a text item for each user
                ) => (
                    <UserImageName id={item.ID}/>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "white"
    },
});

export default SearchPeople;