/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Card.js
 * Displays main feed
 */
// this is the card component for the posts in the feed

import React, {useEffect, useState} from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Container } from "../styling";
import { useNavigation } from '@react-navigation/native';

import EventDetails from './EventDetails'

const getWeekDay = (dateObject) => {
    const dayNumber = dateObject.getDay();
    if (dateObject.getDate() === new Date().getDate() &&
        dateObject.getMonth() === new Date().getMonth &&
        dateObject.getFullYear() === new Date().getFullYear()) {
        return "Today";
    }

    switch (dayNumber) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday"
        case 6:
            return "Sunday";
    }
}

const getMonthName = (dateObject) => {
    const monthNumber = dateObject.getMonth();
    switch (monthNumber) {
        case 0:
            return "January"
        case 1:
            return "February"
        case 2:
            return "March"
        case 3:
            return "April"
        case 4:
            return "May"
        case 5:
            return "June"
        case 6:
            return "July"
        case 7:
            return "August"
        case 8:
            return "September"
        case 9:
            return "October"
        case 10:
            return "November"
        case 11:
            return "December"
    }
}
  
  const parseDate = (dateObject) => {
    return ({
        date: dateObject.getDate(),
        month: getMonthName(dateObject),
        year:dateObject.getFullYear(),
        day:getWeekDay(dateObject),
        hour: dateObject.getHours(),
        minute: dateObject.getMinutes(),
        seconds: dateObject.getSeconds(),
        ampmTime: dateObject.toLocaleString('en-US',
            { hour: 'numeric', minute: 'numeric', hour12: true }),
    })
}

  export const Card = (props) => {
    // const post = props.content;
    // const start = parseDate(post.starttime);
    // const end = parseDate(post.endtime);

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
        
            // <View style={styles.card}>
            //     <View style={styles.eventDetails}>
            //         <Text style={styles.eventName}>{props.eventName}</Text>
            //         <View style={styles.eventDate}>
            //             <Text style={styles.eventDay}>{props.eventDay}</Text>
            //             <Text style={styles.eventTime}>{props.eventTime}</Text>
            //         </View>
            //     </View>
            //     <View style={styles.peopleGoingAndTagsContainer}>
            //         <View style={styles.peopleGoingContainer}>
            //             <Text style={styles.peopleGoing}>{props.peopleGoing} people going</Text>
            //         </View>
            //         <View style={styles.tagsContainer}>
            //             {(props.tags[0] != null) && <Tag tag={props.tags[0]}/>}
            //             {(props.tags[1] != null) && <Tag tag={props.tags[1]}/>}
            //             {(props.tags[2] != null) && <Tag tag={props.tags[2]}/>}
            //         </View>
            //     </View>
            // </View>
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
    
export default Card;
