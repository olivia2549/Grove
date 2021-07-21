/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Login.js
 * This page is where the user navigates to log in
 */

import React, { useState } from "react";
import {StyleSheet, KeyboardAvoidingView, View} from "react-native"
import { FancyButton, FancyInput, } from "../styling";

import firebase from "firebase";

export const Login = () => {
    // The information we need for user registration
    const [state, setState] = useState({
        email: "",
        password: "",
    });

    // Use firebase to sign in an existing user
    const onSignUp = () => {
        firebase.auth()
            .signInWithEmailAndPassword(state.email, state.password)
            .then((result) => {console.log(result)})
            .catch((error) => {console.log(error)})
    }

    // Displays to the screen
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screenContainer}>
            <FancyInput
                placeholder="email"
                onChangeText={(email) => setState({
                    ...state,   // preserve old state
                    email: email})}
            />
            <FancyInput
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(password) => setState({
                    ...state,
                    password: password})}
            />
            <FancyButton title="Sign In" onPress={() => onSignUp()}/>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 16
    }
});

export default Login;
