/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * SearchEvents.js
 * Find events, filter by tag
 */

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {
    FlatList,
    View,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
} from "react-native";
import {FancyInput} from "../styling";
import UserImageName from "./UserImageName";
import {fetchUserOutgoingRequests} from "../../redux/actions";
import firebase from "firebase";
import { Card } from "./Card";

export const SearchEvents = (props) => {
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [eventsToDisplay, setEventsToDisplay] = useState([]);

    useEffect(() => {
        // Initially show all the users in the database sorted by name
        // TODO: sort users using a suggestion algorithm
        firebase
            .firestore()
            .collection("events")
            .orderBy("nameLowercase")
            .startAt(search)
            .endAt(search + "\uf8ff")
            .get()
            .then((snapshot) => {
                let eventsArr = [];
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    eventsArr.push(data); // the object to place in the users array
                })
                setEventsToDisplay(eventsArr);
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
                data={eventsToDisplay}
                keyExtractor={(item, index) => item.ID}
                renderItem={(event) => (
                    // when the card is pressed, we head to EventDetails page
                    <TouchableOpacity
                        key={event.item.ID}
                        onPress={() =>
                            navigation.navigate("EventDetails", {
                                ID: event.item.ID,
                            })
                        }
                    >
                        <Card
                            key={event.item.ID}
                            id={event.item.ID}
                            loading={isLoading}
                        />
                    </TouchableOpacity>
                )}
                style={{margin: 15}}
                showsVerticalScrollIndicator={false}
                onScrollBeginDrag={Keyboard.dismiss}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "white"
    },
});

export default SearchEvents;