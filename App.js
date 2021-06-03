import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from "./components/auth/Register";

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

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing'>
        <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Register" component={RegisterScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
