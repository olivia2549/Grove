/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Landing.js
 * This page is the first to show up before the user logs in
 */

import React, {useEffect} from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native"
import firebase from "firebase";

// 'navigation' gives us access to the route from App.js
export const Landing = ({navigation}) => {
    return (
        <View style={styles.normal}>
            <FancyButton title="Register" onPress={() => navigation.navigate("Register")}/>
            <FancyButton title="Login" onPress={() => navigation.navigate("Login")}/>
        </View>
    );
}

const FancyButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.fancyButtonContainer}>
    <Text style={styles.fancyButtonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
      },
    normal: {
        flex: 1,
        justifyContent: 'center',
    },
    fancyButtonContainer: {
        elevation: 8,
        backgroundColor: "#5DB075",
        borderRadius: 100,
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginVertical: 8,
        marginLeft: 15,
        marginRight: 15
    },
    fancyButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
});

export default Landing;
