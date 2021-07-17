/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { 
    View, 
    Text, 
    TextInput, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
    ScrollView, 
    Animated, 
    Button, 
    Platform, 
    KeyboardAvoidingView, 
    Share,
 } from "react-native";
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { FancyButton, FancyInput } from "../styling";
import {parseDate, } from "./Card";
import firebase from "firebase";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


    const onShare = async () => {
      try {
        const result = await Share.share({
          message:
            'We need to change this to a deep link to the app',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    }

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({navigation, route}) => {
    // get the parameters
    const event = route.params.event.item;
    const start = parseDate(event.startDateTime.toDate());
    const end = parseDate(event.endDateTime.toDate());
    const [goingBtnText, setGoingBtnText] = useState("i'm going");
    const [goingBtnSelected, setGoingBtnSelected] = useState(false);

    // title font size
    const [currentFont, setCurrentFont] = useState(50);

    // gestureName is for knowing which gesture direction user executed
    const [gestureName, setGestureName] = useState("none");

    const onSwipeDown = (gestureState) => {
        navigation.goBack();
    }

    const onGoing = () => {
        setGoingBtnSelected(!goingBtnSelected);
        goingBtnSelected ? setGoingBtnText("i'm not going") : setGoingBtnText("i'm going");
        if (goingBtnSelected) {
            console.log("adding event to users...");
            firebase.firestore().collection("users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                    eventsAttending: firebase.firestore.FieldValue.arrayUnion(event.id)
                })
            // TODO: make this work right
            firebase.firestore().collection("events")
                .doc(event.id)
                .update({
                    attendee: firebase.firestore.FieldValue.arrayUnion(event)
                })
        } else {
            console.log("removing event from users...")
            firebase.firestore().collection("users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                    eventsAttending: firebase.firestore.FieldValue.arrayRemove(event)
                })
            firebase.firestore().collection("events")
                .doc(event.id)
                .update({
                    attendee: firebase.firestore.FieldValue.arrayRemove(event)
                })
        }
    };

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
                > */}

            <GestureRecognizer
                onSwipeDown={(state) => onSwipeDown(state)}
                config={config}
                style={styles.topBar}
                >
                    <Text
                    adjustsFontSizeToFit
                    style={ [styles.eventName, {fontSize: currentFont}]}
                    onTextLayout={ (e) => {
                        const { lines } = e.nativeEvent;
                        if (lines.length > 1) {
                            setCurrentFont(currentFont - 1);
                        }
                    }}
                    >{event.name}</Text>
            </GestureRecognizer>

            <ScrollView style={styles.scrollStyle}>
                <View style={styles.rowFlexContainer}>
                   {
                        event.tags.map((tag) =>
                            <View style={styles.tagBox}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        )
                    }
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{event.description}</Text>
                </View>

                <View style={styles.bigView}>
                    <View style={styles.rowFlexContainer}>
                        <Text style={styles.whereWhen}>Where</Text>
                        <View style={styles.locationView}>
                            {/* this is hard coded, would need to be changed once we fetch info from the data */}
                            <Text style={styles.locationText}>{event.location}</Text>
                        </View>
                    </View>
                    <View style={styles.timeView}>
                        <Text style={styles.startText}>Starts</Text>

                        <View style={styles.startView}>
                            <Text style={styles.startDayText}>{start.day}</Text>
                        </View>
                        <View style={styles.startTimeView}>
                            <Text style={styles.startTimeText}>{start.ampmTime}</Text>
                        </View>
                    </View>
                    <View style={styles.timeView}>
                        <Text  style={styles.endsText}>Ends</Text>

                        <View style={styles.endDayView}>
                            <Text style={styles.endDayText}>{end.day}</Text>
                        </View>
                        <View style={styles.endTimeView}>
                            <Text style={styles.endTimeText}>{end.ampmTime}</Text>
                        </View>
                    </View>
                </View>


                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidContainer}>
                    <Text style={styles.peopleGoingText}>{event.attendees.length} people going</Text>

                </KeyboardAvoidingView>
            </ScrollView>

            <View style={styles.rowFlexContainer}>
                <TouchableOpacity onPress={onShare} style={styles.fancyButtonContainer}>
                    <Text style={styles.fancyButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onGoing}  style={styles.fancyButtonContainer}>
                    <Text style={styles.fancyButtonText}>{goingBtnText}</Text>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'column',
        flex: 1,
        // justifyContent: "center",
    },
    topBar: {
        backgroundColor: '#5DB075',
        width: "100%",
        justifyContent: 'center',
        flex: Platform.OS === 'ios' ? 0.7 : 1,
    },
    bottomBar: {
    },
    tagBox: {
        height: windowHeight * 0.07,
        backgroundColor: "lightgrey",
        marginLeft: 15,
        borderRadius: 10,
        justifyContent: "center",
        padding: 13,
    },
    // for event details
    eventName: {
        color: '#ffffff',
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
        textAlign: "center"
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
        // marginBottom: windowHeight * 0.015,
    },
    locationView: {
        flex: 1, 
        marginLeft: windowWidth * 0.02, 
        justifyContent: "center", 
        height: windowHeight * 0.055, 
        backgroundColor: "lightgrey", 
        borderRadius: 10, 
    },
    locationText: {
        marginLeft: windowWidth * 0.03,  
        color:"black", 
        fontSize: windowWidth * 0.05
    },
    timeView: {
        flexDirection: "row", 
        marginTop: 6,
        marginLeft: 1,
    },
    scrollStyle: {
        flex: Platform.OS === 'ios' ? 0 : 7, 
        top: 10,
    },
    descriptionContainer: {
        padding: windowWidth * 0.05,
    },
    descriptionText: {
        fontSize: windowWidth * 0.07,
    },
    bigView: {
        justifyContent: "center", 
        padding: windowWidth * 0.05,
    },
    rowFlexContainer: {
        flexDirection:"row",
    },
    startText: {
        fontSize: windowWidth * 0.06, 
        fontWeight: "bold", 
        marginTop: 3,
    },
    startView: {
        flex: 1, 
        marginLeft: 15, 
        justifyContent: "center", 
        height: windowHeight * 0.055, 
        backgroundColor: "lightgrey", 
        borderRadius: 10, 
    },
    startDayText: {
        marginLeft: windowWidth * 0.03, 
        color:"black", 
        fontSize: windowWidth * 0.05,
    },
    startTimeView: {
        flex: 1, 
        marginLeft: 15, 
        justifyContent: "center", 
        height: windowHeight * 0.055, 
        backgroundColor: "lightgrey", 
        borderRadius: 10, 
    },
    startTimeText: {
        marginLeft: windowWidth * 0.03, 
        color:"black", 
        fontSize: windowWidth * 0.05,
    },
    endsText: {
        fontSize: windowWidth * 0.06, 
        fontWeight: "bold", 
        marginTop: 2,
    },
    peopleGoingText: {
        fontSize: windowWidth * 0.07, 
        fontWeight: "bold", 
        marginBottom: windowHeight * 0.01,
    },
    endDayView: {
        flex: 1, 
        marginLeft: 25, 
        justifyContent: "center", 
        height: windowHeight * 0.055, 
        backgroundColor: "lightgrey", 
        borderRadius: 10, 
    },
    endDayText: {
        marginLeft: windowWidth * 0.03, 
        color:"black", 
        fontSize: windowWidth * 0.05,
    },
    endTimeView: {
        flex: 1, 
        marginLeft: 15, 
        justifyContent: "center", 
        height: windowHeight * 0.055, 
        backgroundColor: "lightgrey", 
        borderRadius: 10, 
    },
    endTimeText: {
        marginLeft: windowWidth * 0.03, 
        color:"black", 
        fontSize: windowWidth * 0.05,
    },
    keyboardAvoidContainer: {
        justifyContent: "center", 
        padding: windowWidth * .05, 
        flex: 1,
    },
})

export default EventDetails;
