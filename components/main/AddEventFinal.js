/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventFinal.js
 * User posts event
 */

import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import { useSelector } from 'react-redux';

import firebase from "firebase";

export const AddEventFinal = () => {
    var eventData = {
        name: useSelector(state => state.event.name),
        description: useSelector(state => state.event.description),
        tags: useSelector(state => state.event.tags),
        startDateTime: useSelector(state => state.event.startDateTime),
        endDateTime: useSelector(state => state.event.endDateTime),
        location: useSelector(state => state.event.location),
        attendees: [],
    };

    // New event gets added to firebase
    const onPress = async () => {
        const docRef = await firebase.firestore().collection('events').doc();
        eventData.ID = docRef.id;
        eventData.creator = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
        eventData.attendees.push(eventData.creator);
        eventData.nameLowercase = eventData.name.toLowerCase();
        await docRef.set(eventData);
        console.log("Posted to firebase - " + eventData.ID);
    }

    return (
        <View>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    width: 200,
                    height: 50,
                    backgroundColor: '#5DB075',
                    margin: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Text>Post Event</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AddEventFinal;
