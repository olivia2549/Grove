/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Main.js
 * Home screen when the user is logged in
 */

import React, { useEffect } from "react";

import {fetchUser, fetchUserPosts} from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'

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
        dispatch(fetchUserPosts());
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
            <Tab.Screen
                name="AddContainer" component={EmptyScreen}
                listeners={({ navigation }) => ({   // Listens for a tab press
                    tabPress: ev => {
                        ev.preventDefault();    // Allows us to override what happens when tab clicked
                        // Routes to the Add stack screen in App.js, which comes from Add.js component
                        navigation.navigate("Add");
                    }
                })}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                        )
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
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
