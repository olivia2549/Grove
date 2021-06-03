import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native'
import firebase from "firebase";

export class Register extends Component {
    constructor(props) {    // Good practice for new components to always create a constructor and call super(props)
        super(props);

        // The information we need for user registration
        this.state = {
            email: "",
            password: "",
            name: ""
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder="name"
                    onChangeText={(name) => this.setState({name})}
                />
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => this.setState({email})}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password})}
                />
                <Button title="Sign Up" onPress={() => this.onSignUp()}/>
            </View>
        );
    };
};

export default Register;
