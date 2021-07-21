/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Register.js
 * This page is where the user navigates to create a new account
 */

import React, { useState } from 'react';
import { StyleSheet, Alert, View, KeyboardAvoidingView } from 'react-native'

import firebase from "firebase";

import { FancyInput, FancyButton } from '../styling';

const VALID_DOMAINS = ["vanderbilt.edu", "Vanderbilt.edu"];

export const Register = () => {
    // The information we need for user registration
    const [state, setState] = useState({
        email: "",
        password: "",
        name: ""
    });

    // Saves the new user information to firebase
    const onSignUp = () => {
        // Validates the email is from a valid domain
        // TODO: send email to validate
        const domain = state.email.split("@")[1];
        if (VALID_DOMAINS.indexOf(domain) === -1 ){
            Alert.alert(
                "Invalid email",
                "Please use your school email to sign up.",
                [{text: "OK", onPress: () => console.log("OK pressed")}]
            );
            return;
        }
        // Store new user in users collection in firebase
        firebase.auth().createUserWithEmailAndPassword(state.email, state.password)
            .then((result) => {
                let userID = firebase.auth().currentUser.uid;
                firebase.firestore().collection("users")
                    .doc(userID)
                    .set({
                        ID: userID,
                        name: state.name,
                        email: state.email,
                        bio: "",
                        year: -1,
                        major: "",
                        eventsAttending: [],
                        eventsPosted: [],
                    })
        }).catch((error) => {Alert.alert(error)});
    }

    // Displays to the screen
    return (
        <View>
        {/*// <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screenContainer}>*/}
             <FancyInput
                placeholder="Full name"
                onChangeText={(name) => setState({
                    ...state,
                    name: name})}
            />
            <FancyInput
                placeholder="School email"
                onChangeText={(email) => setState({
                    ...state,
                    email: email})}
            />
            <FancyInput
                placeholder="Password"
                secureTextEntry={true}  // type in dots instead of text
                onChangeText={(password) => setState({
                    ...state,
                    password: password})}
            />
            <FancyButton title="Get Started" onPress={() => onSignUp()}/>
        {/*// </KeyboardAvoidingView>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 16
    }
});

export default Register;
