import React, { Component, useState } from 'react'
import { KeyboardAvoidingView, Alert } from 'react-native'
import firebase from 'firebase'
import { useNavigation } from '@react-navigation/native'

import { FancyButton, FancyInput } from '../styling'
//Made the front-end for reset password. Someone needs to handle what happens when someone inputs an email etc

export const ForgotPassword = () => {
  const [state, setState] = useState({email: ""});

  const navigation = useNavigation();

  const resetPassword = () => {
    firebase.auth().sendPasswordResetEmail(state.email).catch((error) => {Alert.alert(error)});
    Alert.alert("Email sent", "Check your email to reset your password",
     [{ text: "OK", onPress: () =>  navigation.goBack()}]);
  }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: 'center'}}>
          <FancyInput
              placeholder="School email" onChangeText={(email) => setState({
                ...state,
                email: email})}
              autoFocus={true}>
          </FancyInput>
          <FancyButton title="Reset Password" onPress={resetPassword}></FancyButton>
        </KeyboardAvoidingView>
      )
}

export default ForgotPassword