/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventInfo.js
 * Allows user to make a new event
 */

import React, { useState, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Button, Text, View, TextInput, Platform, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView} from 'react-native';
import { FancyButtonButLower } from '../styling';

import { useDispatch } from "react-redux";
import { addEventName } from "../../redux/actions";
import AddEventDescription from "./AddEventTags";
import { useSelector } from "react-redux";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const AddEventInfo = () => {
    const currentUser = useSelector(state => state.currentUser);
    const [eventName, setEventName] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{
                backgroundColor: '#5DB075',
                height: "20%",
                width: "100%",
                position: "absolute",
                top: 0,
                justifyContent: 'center',
                flex: 1,
            }}>
                <Text style={{
                    color: '#ffffff',
                    fontWeight: "600",
                    top: '20%',
                    padding: 10,
                    fontSize: windowWidth * .15
                // flex: 1,
                }}>
                    Create Event
                </Text>
            </View>
            <View style={{marginTop: 80, marginBottom: 80}}></View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{justifyContent: 'center', flex: 1}}>
                <TextInput
                    id="eventName"
                    name="eventName"
                    onChangeText={(text) => {setEventName(text)}}
                    placeholder="Event Name..."
                    defaultValue={eventName}
                    style={{fontSize: windowWidth * .12, marginLeft: windowWidth * .05}}
                />
                <FancyButtonButLower title="Next" onPress={() => {navigation.navigate("AddEventDescription", { eventName })}}/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddEventInfo;
