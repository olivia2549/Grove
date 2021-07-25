/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Register.js
 * This page is where the user navigates to create a new account
 */

import React, {useEffect, useState} from 'react';
import { View, Text, Button } from 'react-native'
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase";
import {clearUserData} from "../../redux/actions";

export const VerifyEmail = () => {
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        firebase.auth().currentUser.sendEmailVerification();
    }, []);

    return (
        <View>
            <Text>An email has been sent to {currentUser.email}. Please verify to proceed.</Text>
            <Button title="Resend email" onPress={() => currentUser.sendEmailVerification()}/>
            <Button title="Back to login" onPress={() => firebase.auth().signOut()}/>
            <Button title="Cancel" onPress={() => {
                firebase.firestore().collection("users").doc(currentUser.uid).delete();
                currentUser.delete();
            }}/>
        </View>
    );
};

export default VerifyEmail;
