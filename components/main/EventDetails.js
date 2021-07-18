/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * EventDetails.js
 * Displays the details of an event
 */

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { parseDate } from "./Card";
import firebase from "firebase";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({ navigation, route }) => {
    // get the parameters
    const event = route.params.event.item;
    const start = parseDate(event.startDateTime.toDate());
    const end = parseDate(event.endDateTime.toDate());
    const [goingBtnText, setGoingBtnText] = useState("i'm going");
    const [goingBtnSelected, setGoingBtnSelected] = useState(false);

    // title font size
    const [currentFont, setCurrentFont] = useState(50);

    // Goes back to feed when user swipes down from top
    const onSwipeDown = (gestureState) => {
        navigation.goBack();
    };

    // When the "i'm going" button is pressed
    const onGoing = () => {
        setGoingBtnSelected(!goingBtnSelected);
        goingBtnSelected
            ? setGoingBtnText("i'm not going")
            : setGoingBtnText("i'm going");
        if (goingBtnSelected) {
            console.log("adding event to users...");
            firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                    eventsAttending: firebase.firestore.FieldValue.arrayUnion(event.id),
                });
            // TODO: make this work right
            firebase
                .firestore()
                .collection("events")
                .doc(event.id)
                .update({
                    attendee: firebase.firestore.FieldValue.arrayUnion(event),
                });
        } else {
            console.log("removing event from users...");
            firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                    eventsAttending: firebase.firestore.FieldValue.arrayRemove(event),
                });
            firebase
                .firestore()
                .collection("events")
                .doc(event.id)
                .update({
                    attendee: firebase.firestore.FieldValue.arrayRemove(event),
                });
        }
    };

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
    };

    return (
        <View style={styles.container}>
            <GestureRecognizer
                onSwipeDown={(state) => onSwipeDown(state)}
                config={config}
                style={styles.topBar}
            >
                <Text
                    adjustsFontSizeToFit
                    style={[styles.eventName, { fontSize: currentFont }]}
                    onTextLayout={(e) => {
                        const { lines } = e.nativeEvent;
                        if (lines.length > 1) {
                            setCurrentFont(currentFont - 1);
                        }
                    }}
                >
                    {event.name}
                </Text>
            </GestureRecognizer>

            <ScrollView style={{ flex: Platform.OS === "ios" ? 0 : 7, top: 10 }}>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}
                >
                    {event.tags.map((tag) => (
                        <View style={styles.tagBox}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
                <View style={{ padding: windowWidth * 0.05 }}>
                    <Text style={{ fontSize: windowWidth * 0.07 }}>
                        {event.description}
                    </Text>
                </View>

                <View style={{ justifyContent: "center", padding: windowWidth * 0.05 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.whereWhen}>Where</Text>
                        <View
                            style={{
                                flex: 1,
                                marginLeft: windowWidth * 0.02,
                                justifyContent: "center",
                                height: windowHeight * 0.055,
                                backgroundColor: "lightgrey",
                                borderRadius: 10,
                            }}
                        >
                            {/* this is hard coded, would need to be changed once we fetch info from the data */}
                            <Text
                                style={{
                                    marginLeft: windowWidth * 0.03,
                                    color: "black",
                                    fontSize: windowWidth * 0.05,
                                }}
                            >
                                {event.location}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 6, marginLeft: 1 }}>
                        <Text
                            style={{
                                fontSize: windowWidth * 0.06,
                                fontWeight: "bold",
                                marginTop: 3,
                            }}
                        >
                            Starts
                        </Text>

                        <View
                            style={{
                                flex: 1,
                                marginLeft: 15,
                                justifyContent: "center",
                                height: windowHeight * 0.055,
                                backgroundColor: "lightgrey",
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: windowWidth * 0.03,
                                    color: "black",
                                    fontSize: windowWidth * 0.05,
                                }}
                            >
                                {start.day}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                marginLeft: 15,
                                justifyContent: "center",
                                height: windowHeight * 0.055,
                                backgroundColor: "lightgrey",
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: windowWidth * 0.03,
                                    color: "black",
                                    fontSize: windowWidth * 0.05,
                                }}
                            >
                                {start.ampmTime}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 6, marginLeft: 1 }}>
                        <Text
                            style={{
                                fontSize: windowWidth * 0.06,
                                fontWeight: "bold",
                                marginTop: 2,
                            }}
                        >
                            Ends
                        </Text>

                        <View
                            style={{
                                flex: 1,
                                marginLeft: 25,
                                justifyContent: "center",
                                height: windowHeight * 0.055,
                                backgroundColor: "lightgrey",
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: windowWidth * 0.03,
                                    color: "black",
                                    fontSize: windowWidth * 0.05,
                                }}
                            >
                                {end.day}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                marginLeft: 15,
                                justifyContent: "center",
                                height: windowHeight * 0.055,
                                backgroundColor: "lightgrey",
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: windowWidth * 0.03,
                                    color: "black",
                                    fontSize: windowWidth * 0.05,
                                }}
                            >
                                {end.ampmTime}
                            </Text>
                        </View>
                    </View>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{
                        justifyContent: "center",
                        padding: windowWidth * 0.05,
                        flex: 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: windowWidth * 0.07,
                            fontWeight: "bold",
                            marginBottom: windowHeight * 0.01,
                        }}
                        t
                    >
                        {event.attendees.length} people going
                    </Text>
                </KeyboardAvoidingView>
            </ScrollView>

            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    onPress={() => console.log("share")}
                    style={styles.fancyButtonContainer}
                >
                    <Text style={styles.fancyButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onGoing} style={styles.fancyButtonContainer}>
                    <Text style={styles.fancyButtonText}>{goingBtnText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        backgroundColor: "#5DB075",
        width: "100%",
        justifyContent: "center",
        flex: Platform.OS === "ios" ? 0.7 : 1,
    },
    bottomBar: {},
    tagBox: {
        height: windowHeight * 0.07,
        backgroundColor: "lightgrey",
        marginLeft: 15,
        borderRadius: 10,
        justifyContent: "center",
        padding: 13,
        marginTop: 8,
    },
    // for event details
    eventName: {
        color: "#ffffff",
        fontWeight: "600",
        padding: 20,
    },
    scrollable: {
        flex: 7,
    },
    // for Share and I'm Going Buttons
    buttonContainer: {
        flexDirection: "row",
        // flex: 1,
        alignItems: "flex-end",
        top: "130%",
    },
    fancyButtonContainer: {
        elevation: 8,
        backgroundColor: "#5DB075",
        borderRadius: 100,
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginBottom: 8,
        marginLeft: 15,
        marginRight: 15,
        flex: 1,
        justifyContent: "center",
    },
    fancyButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
        textAlign: "center",
    },
    tagText: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: windowWidth * 0.05,
    },
    whereWhen: {
        fontSize: windowWidth * 0.06,
        fontWeight: "bold",
        marginTop: 3,
    },
});

export default EventDetails;
