/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Landing.js
 * This page is the first to show up before the user logs in
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { FancyButton, } from "../styling";

// 'navigation' gives us access to the route from App.js
export const Landing = ({navigation}) => {
    return (
        <View style={styles.screenContainer}>
            <FancyButton title="Register" onPress={() => navigation.navigate("Register")}/>
            <FancyButton title="Login" onPress={() => navigation.navigate("Login")}/>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 16
    }
});

export default Landing;
