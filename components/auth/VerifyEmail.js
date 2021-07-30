/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Register.js
 * This page is where the user navigates to create a new account
 */

import React, {useEffect, useState} from 'react';
import { View, Text, Button } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { FancyButton } from '../styling';

import firebase from "firebase";
import {clearUserData} from "../../redux/actions";

export const VerifyEmail = () => {
    const currentUser = firebase.auth().currentUser;
    const emailString = `Click here if your email is not ${currentUser.email}`;

    useEffect(() => {
        // firebase.auth().currentUser.sendEmailVerification();
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{fontSize: 26}}>Please click the link we emailed you to verify you're a student.</Text>
            <FancyButton title="Resend email" onPress={() => currentUser.sendEmailVerification()}/>
            <FancyButton title="Done" onPress={() => firebase.auth().signOut()}/>
            <Button color='red' title={emailString} onPress={() => firebase.auth().signOut()}/>
        </View>
    );
};

export default VerifyEmail;
