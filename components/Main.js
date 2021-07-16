/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Main.js
 * Home screen when the user is logged in
 */

import React, { useEffect } from "react";

import {fetchUser, fetchUserEvents, clearData} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

import firebase from "firebase";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'

/**
 * EmptyScreen
 * Dummy component to satisfy TabScreen and allow route to come from App.js instead
 * @returns {null}
 */
const EmptyScreen = () => {
    return null;
}

export const Main = () => {
    const user = useSelector((state) => state.currentUser);
    const dispatch = useDispatch();

    // Fetch the user from firebase when the page mounts
    useEffect(() => {
        dispatch(fetchUser());
        dispatch(fetchUserEvents());
    }, []);

    // Displays to the screen
    return (
        <Tab.Navigator initialRouteName="Feed" labeled={false}>
            <Tab.Screen name="Feed" component={FeedScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={26}/>
                        )
                }}
            />
            <Tab.Screen name="Search" component={SearchScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="account-multiple-plus" color={color} size={26}/>
                        )
                }}
            />
            <Tab.Screen name="AddContainer" component={EmptyScreen}
                listeners={({ navigation }) => ({   // Listens for a tab press
                    tabPress: ev => {
                        ev.preventDefault();    // Allows us to override what happens when tab clicked
                        // Routes to the Add stack screen in App.js, which comes from AddEventName.js component
                        navigation.navigate("AddEventName");
                    }
                })}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                        )
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                listeners={({ navigation }) => ({   // Listens for a tab press
                    tabPress: ev => {
                        ev.preventDefault();    // Allows us to override what happens when tab clicked
                        // Routes to the Add stack screen in App.js, which comes from AddEventName.js component
                        navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid});
                    }
                })}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export default Main;
