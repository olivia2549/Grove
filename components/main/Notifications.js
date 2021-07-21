import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux";



export const Notifications = () => {

    const navigation = useNavigation();

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 72}}>Notifications</Text>
        </View>
    );
}

export default Notifications