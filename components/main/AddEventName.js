/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventName.js
 * Allows user to make a new post
 */

import React, { useState, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Button, Text, View, TextInput, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from "react-redux";
import { addEventName } from "../../redux/actions";
import AddEventDescription from "./AddEventDescription";

const Stack = createStackNavigator();

export const AddEventName = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [eventName, setEventName] = useState("");

    const onChange = (ev) => {
        setEventName(ev.target.value);
    }

    useEffect(() => {
        dispatch(addEventName(eventName));
    })

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Create Event</Text>

            <TextInput
                id="eventName"
                name="eventName"
                onChange={onChange}
                placeholder="Event Name..."
                value={eventName}
            />

            <Button title="Next" onPress={() => {navigation.navigate("AddEventDescription")}}/>
        </View>
    );
};

export default AddEventName;
