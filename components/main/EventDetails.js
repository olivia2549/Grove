/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { Container } from "../styling";

const windowHeight = Dimensions.get('window').width;
const windowWidth = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        backgroundColor: '#5DB075',
        height: windowHeight * 0.3,
        width: "100%",
        position: "absolute",
        top: 0,
        // borderRadius: 20,
        // margin: 10,
    },
    bottomBar: {
        
    },

})

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({navigation, route}) => {

    // get the parameters

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.topBar}>
                    <Text>{route.params?.eventName}</Text>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    );
}



export default EventDetails;
 