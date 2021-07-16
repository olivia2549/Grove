import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AddEventConfirmation = ({ route }) => {
    const eventName = useSelector(state => state.eventName);
    const eventDescription = useSelector(state => state.eventDescription);
    const eventTags = useSelector(state => state.eventTags);
    const startTime = useSelector(state => state.eventStartTime);
    const endTime = useSelector(state => state.eventEndTime);
    const location = useSelector(state => state.location);

    // an object to hold the event data as key and value pairs
    const eventData = {
        name: eventName,
        description: eventDescription,
        tags: eventTags,
        starttime: startTime,
        endtime: endTime,
        location: location,
    };

    return (
        <View style={{ margin: 50 }}>
            <Text>
                {`Event Name: ${eventName}`}
            </Text>
            <Text>
                {`Event Description: ${eventDescription}`}
            </Text>
            <Text>
                {`Event Tags: ${eventTags}`}
            </Text>
            <Text>
                {`Event Start Time: ${startTime}`}
            </Text>
            <Text>
                {`Event End Time: ${endTime}`}
            </Text>
            <Text>
                {`Event Location: ${location}`}
            </Text>
        </View>
    )
}

export default AddEventConfirmation;
