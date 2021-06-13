/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Login.js
 * This page is where the user navigates to log in
 */

import React, {useState, useEffect} from "react";
import { View, Button, TextInput } from "react-native"

import firebase from "firebase";

export const Login = () => {
    // The information we need for user registration
    const [state, setState] = useState({
        email: "",
        password: "",
    })

    // Use firebase to sign in an existing user
    const onSignUp = () => {
        firebase.auth()
            .signInWithEmailAndPassword(state.email, state.password)
            .then((result) => {console.log(result)})
            .catch((error) => {console.log(error)})
    }

    // Displays to the screen
    return (
        <View>
            <TextInput
                placeholder="email"
                onChangeText={(email) => setState({
                    ...state,   // preserve old state
                    email: email})}
            />
            <TextInput
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(password) => setState({
                    ...state,
                    password: password})}
            />
            <Button title="Sign Up" onPress={() => onSignUp()}/>
        </View>
    );
};

export default Login;
