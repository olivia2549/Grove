import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
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

    const onPress = async () => {
        const docRef = await firebase.firestore().collection('events').doc();
        eventData.ID = docRef.id;
        eventData.creator = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
        eventData.attendees.push(eventData.creator);
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
