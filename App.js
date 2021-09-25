/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * App.js
 * Aka index.js -- compiles all the dependencies; it's basically the configuration/settings file
 */

import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { NavigationContainer, Link } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Allows us to use redux
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux';
import allReducers from './redux/reducers';
import thunk from 'redux-thunk'; // allows us to dispatch
const composedEnhancer = compose(applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
);
// export const store = createStore(allReducers, applyMiddleware(thunk));
export const store = createStore(allReducers, composedEnhancer);

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
import VerifyEmailScreen from './components/auth/VerifyEmail';
import ForgotPasswordScreen from './components/auth/ForgotPassword';
import MainScreen from './components/Main';
import AddEventInfo from './components/main/AddEventInfo';
import AddEventTags from './components/main/AddEventTags';
import AddEventDate from './components/main/AddEventDate';
import AddEventConfirmation from './components/main/AddEventConfirmation';
import InviteFriends from "./components/main/InviteFriends";
import ProfileUser from "./components/main/ProfileUser";
import EventDetails from './components/main/EventDetails';
import Notifications from './components/main/Notifications';
import {setDebugModeEnabled} from "expo-firebase-analytics";

const Stack = createStackNavigator();

export const App = () => {
    let [loggedIn, setLoggedIn] = useState(false);
    let [isLoaded, setIsLoaded] = useState(false);

    setDebugModeEnabled(true);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {    // user not logged in
                setLoggedIn(false);
                setIsLoaded(true);
            } else {
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
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='Back'>
                        <Stack.Screen name="Back" component={LandingScreen} options={{headerShown: false}}/>
                        <Stack.Screen name="Register" component={RegisterScreen}/>
                        <Stack.Screen name="Login" component={LoginScreen}/>
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </Provider>
        );
    }

    if (!firebase.auth().currentUser.emailVerified) {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName='VerifyEmail'>
                    <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }

    const MainWithEvents = () => {
        return (
            <Stack.Navigator mode='modal' initialRouteName='Main' screenOptions={{headerShown: false}}>
                <Stack.Screen name="Main" component={MainScreen}/>
                <Stack.Screen name="EventDetails" component={EventDetails}/>
                <Stack.Screen name="InviteFriends" component={InviteFriends}/>
            </Stack.Navigator>
        );
    }

    return (
        // Provider allows us to access the redux store data in our app
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator mode='modal' initialRouteName='MainWithEvents' screenOptions={{
                    headerShown: false
                }}>
                    <Stack.Screen name="MainWithEvents" component={MainWithEvents}/>
                    <Stack.Screen name="AddEventInfo" component={AddEventInfo}/>
                    <Stack.Screen name="AddEventTags" component={AddEventTags}/>
                    <Stack.Screen name="AddEventDate" component={AddEventDate}/>
                    <Stack.Screen name="InviteFriends" component={InviteFriends}/>
                    <Stack.Screen name="AddEventConfirmation" component={AddEventConfirmation}/>
                    <Stack.Screen name="ProfileUser" component={ProfileUser}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        display: "none"
    }
})

export default App;
