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
    const [state, setState] = useState({
        eventName: ""
    });

    const onChange = (ev) => {
        setState({
            ...state,
            eventName: ev.target.value
        });
        dispatch(addEventName(state.eventName));
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Create Event</Text>

            <TextInput
                id="eventName"
                name="eventName"
                onChange={onChange}
                placeholder="Event Name..."
                value={state.eventName}
            />

            <Button title="Next" onPress={() => {navigation.navigate("AddEventDescription")}}/>
        </View>
    );
};

export default AddEventName;
