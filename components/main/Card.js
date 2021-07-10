// this is the card component for the posts in the feed

import React, {useEffect, useState} from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Container } from "../styling";
import { useNavigation } from '@react-navigation/native';

import EventDetails from './EventDetails'


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1C3129',
        padding: 15,
        marginBottom: 20,
        fontFamily: 'Verdana',
        shadowOffset: { width: 4, height: 8 },
        shadowColor: "#000",
        shadowOpacity: 0.15,
        elevation: 14,
        borderRadius: 24,
    },
    eventDetails: {     // wraps eventName and eventDate
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    eventName: {
        flex: 2/3,
        color: '#ffffff',
        fontWeight: "600",
        fontSize: 24,
    },
    eventDate: {        // wraps eventDay and eventTime
        flex: 1/3,
        alignItems: "flex-end",
        flexDirection: "column",
        marginBottom: 60,
    },
    eventDay: {
        textAlign: "right",
        color: '#ffffff',
        fontWeight: "500",
        fontSize: 18,
    },
    eventTime: {
        textAlign: "right",
        color: '#ffffff',
        fontWeight: "500",
        fontSize: 12,
    },
    peopleGoingAndTagsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    peopleGoingContainer: {
        flex: 1/2,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    peopleGoing: {
        color: "white",
        fontWeight: "500",
        fontSize: 18,
    },
    tagsContainer: {
        flex: 1/2,
        alignItems: "flex-end",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
    },
    tags: {
        backgroundColor: '#F6F6F6',
        padding: 5,
        margin: 5,
        borderRadius: 8,
    }
})

export const Card = (props) => {
    const Tag = (props) => {
        return (
            <View style={styles.tags}>
                <Text>{props.tag}</Text>
            </View>
        )
    }

    const OpenEventDetails = () => {
        return (
            <EventDetails
                eventName={props.eventName}
            />
        )
    }
    
    const navigation = useNavigation(); 

    const hello = props.eventName;
  
    
    return (
        
            <View style={styles.card}>
                <View style={styles.eventDetails}>
                    <Text style={styles.eventName}>{props.eventName}</Text>
                    <View style={styles.eventDate}>
                        <Text style={styles.eventDay}>{props.eventDay}</Text>
                        <Text style={styles.eventTime}>{props.eventTime}</Text>
                    </View>
                </View>
                <View style={styles.peopleGoingAndTagsContainer}>
                    <View style={styles.peopleGoingContainer}>
                        <Text style={styles.peopleGoing}>{props.peopleGoing} people going</Text>
                    </View>
                    <View style={styles.tagsContainer}>
                        {(props.tags[0] != null) && <Tag tag={props.tags[0]}/>}
                        {(props.tags[1] != null) && <Tag tag={props.tags[1]}/>}
                        {(props.tags[2] != null) && <Tag tag={props.tags[2]}/>}
                    </View>
                </View>
            </View>        
    )
}

export default Card;
