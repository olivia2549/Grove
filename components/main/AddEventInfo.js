/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventInfo.js
 * Allows user to make a new event
 */

import React, {useState, useRef} from 'react';

import { Button, Text, View, TextInput, Platform, StyleSheet,
    Dimensions, SafeAreaView, KeyboardAvoidingView, Alert} from 'react-native';
import { FancyButtonButLower } from '../styling';

import { useDispatch, useSelector } from "react-redux";
import { addEventDescription, addEventLocation, addEventName } from "../../redux/actions";

import { AddEventTags } from "./AddEventTags"
import { useNavigation } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const AddEventInfo = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const currentUser = useSelector(state => state.currentUser);

    const [name, setName] = useState("");
    const nameRef = useRef(null);

    const [description, setDescription] = useState("");
    const descriptionRef = useRef(null);

    const [location, setLocation] = useState("");
    const locationRef = useRef(null);

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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{justifyContent: 'center', flex: 1, marginTop: windowHeight*.2}}
            >
                <Text>Name</Text>
                <TextInput
                    id="nameInput"
                    name="nameInput"
                    placeholder="Name..."
                    ref={nameRef}
                    onChangeText={(text) => {setName(text)}}
                    returnKeyType="next"
                    autoFocus={true}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                        if (name === "") {
                            Alert.alert("Please add a name for this event.");
                            nameRef.current.focus();
                        }
                        else {
                            descriptionRef.current.focus();
                            dispatch(addEventName(name));
                        }
                    }}
                    defaultValue={name}
                    selectTextOnFocus={true}
                    style={{fontSize: windowWidth * .08, marginLeft: windowWidth * .05, marginBottom: 20}}
                />
                <Text>Description</Text>
                <TextInput
                    id="descriptionInput"
                    name="descriptionInput"
                    placeholder="Description..."
                    ref={descriptionRef}
                    onChangeText={(text) => {setDescription(text)}}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                        if (description === "") {
                            Alert.alert("Please add a description for this event.");
                            descriptionRef.current.focus();
                        }
                        else {
                            locationRef.current.focus();
                            dispatch(addEventDescription(description));
                        }
                    }}
                    selectTextOnFocus={true}
                    value={description}
                    style={{fontSize: windowWidth * .08, marginLeft: windowWidth * .05, marginBottom: 20}}
                />
                <Text>Location</Text>
                <TextInput
                    id="locationInput"
                    name="locationInput"
                    placeholder="Location..."
                    ref={locationRef}
                    blurOnSubmit={false}
                    onChangeText={(text) => {setLocation(text)}}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                        if (location === "") {
                            Alert.alert("Please add a location for this event.");
                            locationRef.current.focus();
                        }
                        else {
                            dispatch(addEventLocation(location));
                            navigation.navigate("AddEventTags");
                        }
                    }}
                    selectTextOnFocus={true}
                    value={location}
                    style={{fontSize: windowWidth * .08, marginLeft: windowWidth * .05, marginBottom: 20}}
                />
                <FancyButtonButLower title="Next" onPress={() => {navigation.navigate("AddEventTags")}}/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddEventInfo;
