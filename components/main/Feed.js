/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, { useState, useEffect } from "react";
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
    Keyboard, SafeAreaView,
} from "react-native";
import { SearchEvents } from "./SearchEvents";

import { useDispatch } from "react-redux";
import { fetchUserOutgoingRequests } from "../../redux/actions";
import {setCurrentScreen, setDebugModeEnabled} from "expo-firebase-analytics";
require("firebase/firestore");

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Feed = () => {
    const dispatch = useDispatch();
    setDebugModeEnabled(true);
    setCurrentScreen("Feed");

    const [toggleSide, setToggleSide] = useState("flex-start");
    const [loadingPopular, setLoadingPopular] = useState(false);
    const [loadingUpcoming, setLoadingUpcoming] = useState(false);

    useEffect(() => {
        // Fetch outgoingRequests
        dispatch(fetchUserOutgoingRequests());
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <View style={{alignItems: "center"}}>
                    <Text style={{ fontSize: 32, fontWeight: "bold", top: 7 }}>Grove</Text>
                </View>

                {/* Toggle Button */}
                <TouchableOpacity
                    style={[styles.toggleContainer, { justifyContent: toggleSide }]}
                    onPress={() => {
                        if (toggleSide === "flex-start") {
                            setToggleSide("flex-end");
                            setLoadingPopular(true);
                        } else {
                            setToggleSide("flex-start");
                            setLoadingUpcoming(true);
                        }
                    }}
                    activeOpacity="0.77"
                >
                    {/* Upcoming pressed */}
                    {toggleSide === "flex-start" && (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={styles.upcomingEventsContainer}>
                                <Text style={styles.toggleText}>Upcoming</Text>
                            </View>
                            <View style={styles.popularEventsGreyTextContainer}>
                                <Text style={styles.popularEventsGreyText}>Popular</Text>
                            </View>
                        </View>
                    )}

                    {/* Popular pressed */}
                    {toggleSide === "flex-end" && (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={styles.upcomingEventsGreyTextContainer}>
                                <Text style={styles.upcomingEventsGreyText}>Upcoming</Text>
                            </View>
                            <View style={styles.popularEventsContainer}>
                                <Text style={styles.toggleText}>Popular</Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                {toggleSide === "flex-start" && (
                    <SearchEvents loading={loadingUpcoming} upcoming={true}/>
                )
                }
                {toggleSide === "flex-end" && (
                    <SearchEvents loading={loadingPopular} upcoming={false}/>
                )
                }

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "white"
    },
    /* toggle button */
    toggleContainer: {
        // flex: 1 / 7,
        flexDirection: "row",
        marginHorizontal: windowWidth * 0.055,
        marginTop: windowHeight * .03,
        height: "7%",
        backgroundColor: "#ededed",
        borderRadius: 30,
        borderWidth: 0.3,
        borderColor: "grey",
    },
    upcomingEventsContainer: {
        // when upcoming button is clicked
        flex: 1,
        backgroundColor: "white",
        borderRadius: 30,
        height: "97%",
        justifyContent: "center",
    },
    popularEventsGreyTextContainer: {
        flex: 1,
        height: "97%",
        justifyContent: "center",
    },
    popularEventsGreyText: {
        color: "#BDBDBD",
        fontWeight: "500",
        fontSize: windowWidth * 0.04,
        textAlign: "center",
    },
    // when events added button is clicked
    popularEventsContainer: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 30,
        height: "97%",
        justifyContent: "center",
    },
    upcomingEventsGreyTextContainer: {
        flex: 1,
        height: "97%",
        justifyContent: "center",
    },
    upcomingEventsGreyText: {
        color: "#BDBDBD",
        fontWeight: "500",
        fontSize: windowWidth * 0.04,
        textAlign: "center",
    },
    toggleText: {
        textAlign: "center",
        fontWeight: "500",
        fontSize: windowWidth * 0.04,
        color: "#5DB075",
    },
});

export default Feed;
