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

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'column',
        flex: 1,
        justifyContent: "center",
    },
    topBar: {
        backgroundColor: '#5DB075',
        height: "20%",
        width: "100%",
        position: "absolute",
        top: 0,
        justifyContent: 'center',
        flex: 1/2,
        // flexDirection: 'row',
        // borderRadius: 20,
        // margin: 10,
    },
    bottomBar: {
        
    },

    // for event details
    eventName: {
        color: '#ffffff',
        fontWeight: "600",
        top: '20%',
        padding: 10
        // flex: 1,
    },
    scrollable: {
        top: "14%",
        // flex: 1/2,
    },
    
    // for Share and I'm Going Buttons
    buttonContainer: {
        flexDirection: "row",
        flex: 1,
        alignItems: "flex-end",
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
    },
    fancyButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
})

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({navigation, route}) => {
    // get the parameters
    const { eventName, eventDetail, eventDay, eventTime, peopleGoing, tags } = route.params;

    // title font size 
    const [currentFont, setCurrentFont] = useState(windowWidth * 0.12);

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
                    >{eventName}</Text>
            </GestureRecognizer>
            {/* <View style={{height: 30, width: 100, backgroundColor: "black"}}></View> */}
            <ScrollView style={styles.scrollable}>
                <View style={{flexDirection:"row", marginTop: windowHeight * 0.04}}>
                   {
                        tags.map((tag) => 
                            <View style={{height: windowHeight * 0.07, backgroundColor: "lightgrey", marginLeft: 15, borderRadius: 10, justifyContent: "center", padding: 13}}>
                                <Text style={{color: "black", fontWeight: "bold", textAlign: "center", fontSize: windowWidth * 0.05}}>{tag}</Text>
                            </View>
                        )
                    } 
                </View>
                <View style={{padding: windowWidth * 0.05}}>
                    <Text style={{fontSize: windowWidth * 0.07}}>{eventDetail}</Text>
                </View>

                <View style={{justifyContent: "center", padding: windowWidth * 0.05}}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{fontSize: windowWidth * 0.06, fontWeight: "bold",  marginBottom: windowHeight * 0.015}}>Where</Text>
                        <View style={{marginLeft: windowWidth * 0.02, marginTop: -windowWidth * 0.02, width: windowWidth * 0.688, height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            {/* this is hard coded, would need to be changed once we fetch info from the data */}
                            <Text style={{marginLeft: windowWidth * 0.03, marginTop: windowWidth * 0.03, color:"black", fontSize: windowWidth * 0.05}}>Wilson Lawn</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 15, marginLeft: 1}}>
                        <Text style={{fontSize: windowWidth * 0.06, fontWeight: "bold", marginBottom: windowHeight * 0.015}}>Starts</Text>
                      
                        <View style={{flex: 1, marginLeft: windowWidth * 0.03, marginTop: -10, height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            <Text style={{marginLeft: windowWidth * 0.03, marginTop: windowWidth * 0.027, color:"black", fontSize: windowWidth * 0.05}}>{eventDay}</Text>
                        </View>
                        <View style={{flex: 1, marginLeft: 10, marginTop: -10, height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            <Text style={{marginLeft: windowWidth * 0.03, marginTop: windowWidth * 0.027, color:"black", fontSize: windowWidth * 0.05}}>{eventTime}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", marginTop: windowWidth * 0.029, marginLeft: 1}}>
                        <Text  style={{fontSize: windowWidth * 0.06, fontWeight: "bold"}}>Ends</Text>

                        <View style={{flex: 1, marginLeft: windowWidth * 0.06, marginTop: -windowWidth * 0.02, height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            <Text style={{marginLeft: windowWidth * 0.03, marginTop: windowWidth * 0.03, color:"black", fontSize: windowWidth * 0.05}}>{eventDay}</Text>
                        </View>
                        <View style={{flex: 1, marginLeft: windowWidth * 0.027, marginTop: -windowWidth * 0.02, height: windowHeight * 0.055, backgroundColor: "lightgrey", borderRadius: 10, }}>
                            <Text style={{marginLeft: windowWidth * 0.03, marginTop: windowWidth * 0.03, color:"black", fontSize: windowWidth * 0.05}}>{eventTime}</Text>
                        </View>
                    </View>
                </View>
                
                <View style={{justifyContent: "center", padding: windowWidth * 0.05}}>
                    <Text style={{fontSize: windowWidth * 0.07, fontWeight: "bold", marginBottom: windowHeight * 0.01}}t>{peopleGoing} people going</Text>     
                    

                        <FancyInput
                            placeholder="Search"
                            onChangeText={console.log("search bar activated")}
                        />  

                </View>
                
                   
            </ScrollView>
            {/* </KeyboardAvoidingView> */}
            <View style={styles.buttonContainer}>
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
 