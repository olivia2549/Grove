/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated, Button,Platform, KeyboardAvoidingView
 } from "react-native";
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { FancyButton, FancyInput } from "../styling";
import {parseDate, } from "./Card";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

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
        marginBottom: windowHeight * 0.015,
    },
})

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({navigation, route}) => {
    // get the parameters
    const { name, description, starttime, endtime, location, attendee, tags } = route.params.post.item;
    const start = parseDate(starttime.toDate());
    const end = parseDate(endtime.toDate());

    // title font size 
    const [currentFont, setCurrentFont] = useState(50);

    // gestureName is for knowing which gesture direction user executed
    const [gestureName, setGestureName] = useState("none");

    const onSwipeDown = (gestureState) =>{
        navigation.goBack();
    }

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
                    >{name}</Text>
            </GestureRecognizer>
      
            <ScrollView style={{flex: Platform.OS === 'ios' ? 0 : 7, top: 10}}>
                <View style={{flexDirection:"row"}}>
                   {
                        tags.map((tag) => 
                            <View style={styles.tagBox}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        )
                    }
                </View>
                <View style={{padding: windowWidth * 0.05}}>
                    <Text style={{fontSize: windowWidth * 0.07}}>{description}</Text>
                </View>

                <View style={{justifyContent: "center", padding: windowWidth * 0.05}}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.whereWhen}>Where</Text>
                        <View style={{marginLeft: windowWidth * 0.02, justifyContent: "center", width: "77.3%", height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            {/* this is hard coded, would need to be changed once we fetch info from the data */}
                            <Text style={{marginLeft: windowWidth * 0.03,  color:"black", fontSize: windowWidth * 0.05}}>{location}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 6, marginLeft: 1}}>
                        <Text style={{fontSize: windowWidth * 0.06, fontWeight: "bold", marginBottom: windowHeight * 0.015}}>Starts</Text>
                      
                        <View style={{flex: 1, marginLeft: windowWidth * 0.03, justifyContent: "center", height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            <Text style={{marginLeft: windowWidth * 0.03, color:"black", fontSize: windowWidth * 0.05}}>{start.day}</Text>
                        </View>
                        <View style={{flex: 1, marginLeft: 10, justifyContent: "center", height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            <Text style={{marginLeft: windowWidth * 0.03, color:"black", fontSize: windowWidth * 0.05}}>{start.ampmTime}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 6, marginLeft: 1}}>
                        <Text  style={{fontSize: windowWidth * 0.06, fontWeight: "bold"}}>Ends</Text>

                        <View style={{flex: 1, marginLeft: windowWidth * 0.06, justifyContent: "center", height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            <Text style={{marginLeft: windowWidth * 0.03, color:"black", fontSize: windowWidth * 0.05}}>{end.day}</Text>
                        </View>
                        <View style={{flex: 1, marginLeft: windowWidth * 0.027, justifyContent: "center", height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            <Text style={{marginLeft: windowWidth * 0.03, color:"black", fontSize: windowWidth * 0.05}}>{end.ampmTime}</Text>
                        </View>
                    </View>
                </View>
                
                
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{justifyContent: "center", padding: windowWidth * .05, flex: 1}}>
                    <Text style={{fontSize: windowWidth * 0.07, fontWeight: "bold", marginBottom: windowHeight * 0.01}}t>{attendee.length} people going</Text>

                </KeyboardAvoidingView>
            </ScrollView>

            <View style={{ flexDirection: "row"}}>
                <TouchableOpacity onPress={() => console.log("share")} style={styles.fancyButtonContainer}>
                    <Text style={styles.fancyButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("i'm going")}  style={styles.fancyButtonContainer}>
                    <Text style={styles.fancyButtonText}>I'm Going</Text>
                </TouchableOpacity>
            </View>

            
        </SafeAreaView>
    );
}



export default EventDetails;
 