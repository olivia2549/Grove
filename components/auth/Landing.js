/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Landing.js
 * This page is the first to show up before the user logs in
 */

import React from "react";
import { View, Button } from "react-native"

// 'navigation' gives us access to the route from App.js
export const Landing = ({navigation}) => {
    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Button title="Register" onPress={() => navigation.navigate("Register")}/>
            <Button title="Login" onPress={() => navigation.navigate("Login")}/>
        </View>
    );
}

export default Landing;
