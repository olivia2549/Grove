/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventName.js
 * Allows user to make a new post
 */

import React, { useState, useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Button, Text, View, TextInput, Platform } from 'react-native';

import { useDispatch } from "react-redux";
import { addEventName } from "../../redux/actions";
import AddEventDescription from "./AddEventDescription";

export const AddEventName = () => {
    const navigation = useNavigation();
    const [name, setName] = useState("");


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Create Event</Text>

            <TextInput
                id="name"
                name="name"
                onChangeText={(text) => {setName(text)}}
                placeholder="Event Name..."
                defaultValue={name}
            />

            <Button title="Next" onPress={() => {navigation.navigate("AddEventDescription", { name })}}/>

        </View>
    );
};

export default AddEventName;
