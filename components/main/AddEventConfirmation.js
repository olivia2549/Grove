/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventConfirmation.js
 * Previews new event to be posted
 */

import React from 'react';
import { View, Text, Button } from 'react-native';

import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";

const AddEventConfirmation = () => {
    const navigation = useNavigation();

    // Grabs event data from redux, stores as an object
    const eventData = {
        name: useSelector(state => state.event.name),
        description: useSelector(state => state.event.description),
        tags: useSelector(state => state.event.tags),
        startDateTime: useSelector(state => state.event.startDateTime),
        endDateTime: useSelector(state => state.event.endDateTime),
        location: useSelector(state => state.event.location),
    };

    return (
        <View style={{ marginTop: 50, marginLeft: 15 }}>
            <Text style={{ fontSize: 36, fontWeight: "bold" }}>
                {eventData.name}
            </Text>
            <Text>
                {eventData.description}
            </Text>
            <Text>
                {`Where: ${eventData.location}`}
            </Text>
            <View style={{flexDirection:"row", height: 60}}>
                {
                    eventData.tags.map((tag) =>
                        <View key={tag} style={{height: 45, backgroundColor: "lightgrey", marginLeft: 15, borderRadius: 10, justifyContent: "center", padding: 13}}>
                            <Text style={{color: "black", fontWeight: "bold", textAlign: "center", fontSize: 16}}>{tag}</Text>
                        </View>
                    )
                }
            </View>
            <Text>
                {`Event Start Time: ${eventData.startDateTime}`}
            </Text>
            <Text>
                {`Event End Time: ${eventData.endDateTime}`}
            </Text>

            <Button
                title="Looks good!"
                onPress={() => {
                    navigation.navigate("AddEventFinal");
                }}
            />
        </View>
    )
}

export default AddEventConfirmation;
