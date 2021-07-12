/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Register.js
 * This page is where the user navigates to create a new account
 */

import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native'
import firebase from "firebase";
import { FancyInput, fancyButton, FancyButton } from '../styling';

export const Register = () => {
    // The information we need for user registration
    const [state, setState] = useState({
        email: "",
        password: "",
        name: ""
    })

    // Saves the new user information to firebase
    const onSignUp = () => {
        firebase.auth().createUserWithEmailAndPassword(state.email, state.password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name: state.name,
                        email: state.email
                    })
        }).catch((error) => {console.log(error)})
    }

    // Displays to the screen
    return (
        <View style={styles.screenContainer}>
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
            <FancyButton title="Sign Up" onPress={() => onSignUp()}/>
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
