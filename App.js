import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Allows us to use redux
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk' // allows us to dispatch
const store = createStore(rootReducer, applyMiddleware(thunk))

import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBBf4Ee-D0Yp-xNgFwdxJVrXUaDbF69jRI",
    authDomain: "grove-ecc8a.firebaseapp.com",
    projectId: "grove-ecc8a",
    storageBucket: "grove-ecc8a.appspot.com",
    messagingSenderId: "427060203214",
    appId: "1:427060203214:web:5a6c9e498689780029ca9f",
    measurementId: "G-JJ71S54XW8"
};

// make sure a firebase instance isn't already running
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main'

const Stack = createStackNavigator();
export const App = () => {
    let [loggedIn, setLoggedIn] = useState(false);
    let [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {    // user not logged in
                setLoggedIn(false);
                setIsLoaded(true);
            }
            else {
                setLoggedIn(true);
                setIsLoaded(true);
            }
        })
    })

    if (!isLoaded) {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text>Loading...</Text>
            </View>
        )
    }

    if (!loggedIn) {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Landing'>
                    <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="Register" component={RegisterScreen}/>
                    <Stack.Screen name="Login" component={LoginScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        // Provider allows us to access redux
        <Provider store={store}>
            <MainScreen/>
        </Provider>
    )

}

export default App;
