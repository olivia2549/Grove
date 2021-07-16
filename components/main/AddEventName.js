/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventName.js
 * Allows user to make a new event
 */

import React, { useState, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Button, Text, View, TextInput, Platform } from 'react-native';

import { useDispatch } from "react-redux";
import { addEventName } from "../../redux/actions";
import AddEventDescription from "./AddEventDescription";
import { useSelector } from "react-redux";

export const AddEventName = () => {
    const currentUser = useSelector(state => state.currentUser);
    const [eventName, setEventName] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Create Event</Text>

            <TextInput
                id="name"
                name="name"
                onChangeText={(text) => {setEventName(text)}}
                placeholder="Event Name..."
                defaultValue={eventName}
            />

            <Button 
                title="Next" 
                onPress={() => {
                    dispatch(addEventName(eventName));
                    navigation.navigate("AddEventDescription")}}
            />
        </View>
    );
};

export default AddEventName;
