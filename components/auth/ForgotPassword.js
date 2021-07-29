import React, { Component } from 'react'
import { KeyboardAvoidingView } from 'react-native'

import { FancyButton, FancyInput } from '../styling'
//Made the front-end for reset password. Someone needs to handle what happens when someone inputs an email etc

export const ForgotPassword = () => {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: 'center'}}>
          <FancyInput placeholder="School email"></FancyInput>
          <FancyButton title="Reset Password"></FancyButton>
        </KeyboardAvoidingView>
      )
}

export default ForgotPassword