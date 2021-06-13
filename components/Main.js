/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Main.js
 * Home screen when the user is logged in
 */

import React, { useEffect } from "react";
import { Text, View } from "react-native"

import { fetchUser } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

export const Main = () => {
    const user = useSelector((state) => state.currentUser);
    const dispatch = useDispatch();

    // Fetch the user from firebase when the page mounts
    useEffect(() => {
        dispatch(fetchUser());
    }, []);

    // Firebase error occurred; user wasn't found
    if (user === null) return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Text>User does not exist</Text>
        </View>
    );

    // Displays to the screen
    else {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text>{user.name} is logged in</Text>
            </View>
        );
    }
}

export default Main;
