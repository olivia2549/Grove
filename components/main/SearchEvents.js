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
    Keyboard, Text, Dimensions,
} from "react-native";
import {FancyInput} from "../styling";
import UserImageName from "./UserImageName";
import {fetchUserOutgoingRequests} from "../../redux/actions";
import firebase from "firebase";
import { Card } from "./Card";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const SearchEvents = (props) => {
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [eventsToDisplay, setEventsToDisplay] = useState([]);

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState("default");

    const [yPos, setYPos] = useState(0);

    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        setSelectedTags([]);
        setShowSearch("default");
    }, [props.loading]);

    useEffect(() => {
        // Initially show all the events in the database sorted by name
        // TODO: sort using a suggestion algorithm
        firebase
            .firestore()
            .collection("events")
            .orderBy("nameLowercase")
            .startAt(search)
            .endAt(search + "\uf8ff")
            .get()
            .then((snapshot) => {
                let eventsArr = [];
                const date = new Date();
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    // if the peopleInvited collections to this event doesn't contain the current user, return;
                    if (data.peopleInvited.indexOf(firebase.auth().currentUser.uid) === -1
                    && data.peopleInvited.length !== 0) return;
                    if (selectedTags.length === 0 && date <= doc.data().startDateTime.toDate()) {
                        eventsArr.push(data);
                    }
                    selectedTags.forEach((tag) => {
                        if (data.tags.indexOf(tag) !== -1 && date <= doc.data().startDateTime.toDate()) {
                            eventsArr.push(data);
                        }
                    });
                });
                if (eventsArr.length > 1) {
                    props.upcoming ?
                        eventsArr.sort((a, b) => a.startDateTime.toDate() - b.startDateTime.toDate())
                        : eventsArr.sort((a, b) => b.attendees.length - a.attendees.length);
                }
                setEventsToDisplay(eventsArr);
                setIsLoading(false);
            });
    }, [props.loading, isLoading]);

    const allTags = [
        "Activism",
        "Cultural",
        "Free food",
        "Orgs",
        "Party",
        "Performances",
        "Professional",
        "Service",
        "Social",
        "Speakers",
        "Sports",
    ];

    const Tag = (props) => {
        const tagName = props.title;
        const color = selectedTags.indexOf(tagName) === -1 ? "lightgray" : "#5db075";
        const textColor = selectedTags.indexOf(tagName) === -1 ? "black" : "white"

        const onPress = () => {
            setIsLoading(true);
            if (selectedTags.indexOf(tagName) === -1) {
                selectedTags.push(tagName);
            } else {
                selectedTags.splice(selectedTags.indexOf(tagName), 1);
            }
        }

        return (
            <TouchableOpacity
                onPress={onPress}
                style={[styles.eachTag, { backgroundColor: color }]}
                activeOpacity={0.6}
            >
                <Text style={[styles.tagText, {color: textColor}]}>{tagName}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{display: showSearch}}>
                <FancyInput
                    placeholder="Search..."
                    onChangeText={(search) => {
                        const searchLower = search.toLowerCase();
                        setSearch(searchLower);
                        setIsLoading(true);
                    }}
                    returnKeyType="search"
                    style={{margin: 15}}
                />
                <View style={styles.tagsFormat}>
                    {allTags.map((tag, i) => {
                        return <Tag key={i} title={tag} />;
                    })}
                </View>
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
                onScroll={(e) => {
                    Keyboard.dismiss();
                    const scrollPosition = e.nativeEvent.contentOffset.y;
                    if (scrollPosition <= 0) setShowSearch("default");
                    else if (scrollPosition > yPos) setShowSearch("none");
                    setYPos(scrollPosition);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "white"
    },
    eachTag: {
        borderRadius: 20,
        padding: windowWidth * 0.03,
        margin: 5,
        justifyContent: "center",
    },
    tagText: {
        textAlign: "center",
        fontWeight: "500",
        fontSize: windowWidth * 0.04,
    },
    tagsFormat: {
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
    },
});

export default SearchEvents;
