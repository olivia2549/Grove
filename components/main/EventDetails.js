/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated, } from "react-native";
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    topBar: {
        backgroundColor: '#5DB075',
        height: windowHeight * 0.1,
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
        // flex: 1,
    },
    scrollable: {
        flex: 1/2,
    }
})

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({navigation, route}) => {

    // get the parameters
    const { eventName, eventDay, eventTime, peopleGoing, tags } = route.params;

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.topBar}>
                    <Text style={styles.eventName}>{eventName}</Text>
                </View>
                <ScrollView style={styles.scrollable}>
                    <View >
                        <Text>{eventDay}</Text>
                        <Text>{eventTime}</Text>
                        <Text>{peopleGoing}</Text>
                        <Text>__</Text>
                        {
                            tags.map((tag) => <Text>{tag}</Text>)
                        }
                    </View>
                </ScrollView>
        </SafeAreaView>
    );
}



export default EventDetails;
 