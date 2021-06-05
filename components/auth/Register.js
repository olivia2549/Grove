import React, { useState } from 'react';
import { View, Button, TextInput } from 'react-native'
import firebase from "firebase";

export const Register = () => {
    // The information we need for user registration
    const [state, setState] = useState({
        email: "",
        password: "",
        name: ""
    })

    const onSignUp = () => {
        firebase.auth().createUserWithEmailAndPassword(state.email, state.password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set(state.name, state.email)    // saves the data to firebase
                console.log(result)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <View>
            <TextInput
                placeholder="name"
                onChangeText={(name) => setState({
                    ...state,
                    name: name})}
            />
            <TextInput
                placeholder="email"
                onChangeText={(email) => setState({
                    ...state,
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

export default Register;
