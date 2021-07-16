import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AddEventConfirmation = () => {
    // an object to hold the event data as key and value pairs
    const eventData = {
        name: useSelector(state => state.event.eventName),
        description: useSelector(state => state.event.eventDescription),
        tags: useSelector(state => state.event.eventTags),
        starttime: useSelector(state => state.event.eventStartTime),
        endtime: useSelector(state => state.event.eventEndTime),
        location: useSelector(state => state.event.eventLocation),
    };

    console.log(eventData.starttime);

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
                        <View style={{height: 45, backgroundColor: "lightgrey", marginLeft: 15, borderRadius: 10, justifyContent: "center", padding: 13}}>
                            <Text style={{color: "black", fontWeight: "bold", textAlign: "center", fontSize: 16}}>{tag}</Text>
                        </View>
                    )
                }
            </View>
            <Text>
                {`Event Start Time: ${eventData.starttime}`}
            </Text>
            <Text>
                {`Event End Time: ${eventData.endtime}`}
            </Text>
        </View>
    )
}

export default AddEventConfirmation;
