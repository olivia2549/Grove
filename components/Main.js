/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Main.js
 * Home screen when the user is logged in
 */

import React, { useEffect } from "react";

import {fetchUser, fetchUserFriends} from "../redux/actions";
import { useDispatch } from "react-redux";

import firebase from "firebase";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'
import NotificationsScreen from "./main/Notifications";

// Dummy component to satisfy TabScreen and allow route to come from App.js instead
const EmptyScreen = () => {
    return null;
}

export const Main = () => {
    const dispatch = useDispatch();

    // When the page first mounts, we have a newly registered user.
    // We need to grab this user and their events from firebase, and store in redux
    useEffect(() => {
        dispatch(fetchUser());
        dispatch(fetchUserFriends());
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
                        // Routes to the Add stack screen in App.js, which comes from AddEventInfo.js component
                        navigation.navigate("AddEventInfo");
                    }
                })}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                        )
                }}
            />
            <Tab.Screen name="Notifications" component={NotificationsScreen}
                listeners={({ navigation }) => ({   // Listens for a tab press
                    tabPress: ev => {
                        ev.preventDefault();    // Allows us to override what happens when tab clicked
                        // Routes to the Add stack screen in App.js, which comes from AddEventInfo.js component
                        navigation.navigate("Notifications");
                    }
                })}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="bell" color={color} size={26}/>
                    )
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                listeners={({ navigation }) => ({   // Listens for a tab press
                    tabPress: ev => {
                        ev.preventDefault();    // Allows us to override what happens when tab clicked
                        // Routes to the Add stack screen in App.js, which comes from AddEventInfo.js component
                        navigation.navigate("Profile");
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
