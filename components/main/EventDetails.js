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
})

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({navigation, route}) => {
    // get the parameters
    const { eventName, eventDay, eventTime, peopleGoing, tags } = route.params;

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
                    numberOfLines={ 1 }
                    adjustsFontSizeToFit
                    style={ [styles.eventName, {fontSize: currentFont}]}
                    onTextLayout={ (e) => {
                        const { lines } = e.nativeEvent;
                        if (lines.length > 1) {
                            setCurrentFont(currentFont - 1);
                        }
                    } }
                    >
                        {eventName}</Text>
                </GestureRecognizer>
    

                

                {/* <View style={{height: 30, width: 100, backgroundColor: "black"}}></View> */}
                <ScrollView style={styles.scrollable}>
                        <Text>{eventDay}</Text>
                        <Text>{eventTime}</Text>
                        <Text>{peopleGoing}</Text>
                        <Text>__</Text>
                        {
                            tags.map((tag) => <Text>{tag}</Text>)
                        }
                </ScrollView>

                

                
        </SafeAreaView>
    );
}



export default EventDetails;
 