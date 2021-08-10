/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Login.js
 * This page is where the user navigates to log in
 */

import React, { useState } from "react";
import {
    StyleSheet,
    KeyboardAvoidingView,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Button,
    Alert
} from "react-native"
import { FancyButton, FancyInput, } from "../styling";
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase";

export const Login = () => {
    // The information we need for user registration
    const [state, setState] = useState({
        email: "",
        password: "",
    });

    const navigation = useNavigation();

    // Use firebase to sign in an existing user
    const onSignUp = () => {
        if (state.email == "" || state.password == "") {
            Alert.alert(
                "Error", "Please fill in all fields", 
                [{text: 'OK', onPress: () => console.log('OK Pressed')}]
            );
            return;
        }
        try {
            firebase.auth()
                .signInWithEmailAndPassword(state.email, state.password)
                .then((result) => {console.log(result)})
        }
        catch (error) {
            Alert.alert(error);
        }
    }

    // Displays to the screen
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screenContainer}>
                <FancyInput
                    placeholder="email"
                    onChangeText={(email) => setState({
                        ...state,   // preserve old state
                        email: email})}
                    autoFocus={true}
                />
                <FancyInput
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => setState({
                        ...state,
                        password: password})}
                />
                <FancyButton title="Sign In" onPress={() => onSignUp()}/>
                <Button
                title='Forgot Password?'
                onPress={() => {navigation.navigate("ForgotPassword")}}
                titleStyle={{
                color: '#039BE5'
                }}
                type='clear'
            />
            </KeyboardAvoidingView>
            
        </TouchableWithoutFeedback>
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
