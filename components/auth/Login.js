import React, {useState, useEffect} from "react";

import { View, Button, TextInput } from 'react-native'
import firebase from "firebase";

export const Login = () => {
        // The information we need for user registration
        const [state, setState] = useState({
            email: "",
            password: "",
        })

    const onSignUp = () => {
        firebase.auth().signInWithEmailAndPassword(state.email, state.password).then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })
    }

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
