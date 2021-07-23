/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Register.js
 * This page is where the user navigates to create a new account
 */

import React, { useState } from 'react';
import { View, Text, Button } from 'react-native'
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase";

export const VerifyEmail = () => {
    const navigation = useNavigation();
    const email = firebase.auth().currentUser.email;

    return (
        <View>
            <Text>An email has been sent to {email}. Please verify to proceed.</Text>
            <Button title="Cancel" onPress={() => navigation.navigate("/")}/>
        </View>
    );
};

export default VerifyEmail;
