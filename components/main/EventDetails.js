/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated, Button, } from "react-native";
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
                            <View style={{height: windowHeight * 0.08, backgroundColor: "lightgrey", marginLeft: 15, borderRadius: 10, justifyContent: "center", padding: 13}}>
                                <Text style={{color: "black", fontWeight: "bold", textAlign: "center", fontSize: windowWidth * 0.05}}>{tag}</Text>
                            </View>
                        )
                    } 
                </View>
                <View style={{padding: windowWidth * 0.05}}>
                    <Text style={{fontSize: 25}}>{eventDetail}</Text>
                </View>

                <View style={{justifyContent: "center", padding: windowWidth * 0.05}}>
                    <View>
                        <Text style={{fontSize: 25, fontWeight: "bold", marginTop: -windowHeight * 0.03, marginBottom: windowHeight * 0.015}}>Where</Text>
                    </View>
                    <View>
                        <Text style={{fontSize: 25, fontWeight: "bold", marginBottom: windowHeight * 0.015}}>Starts</Text>
                    </View>
                    <View>
                        <Text  style={{fontSize: 25, fontWeight: "bold"}}>Ends</Text>
                    </View>
                </View>
                
                
                    <Text>{eventDay}</Text>
                    <Text>{eventTime}</Text>
                    <Text>{peopleGoing}</Text>
                    <Text>__</Text>
                   
            </ScrollView>

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
 