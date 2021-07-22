/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Card.js
 * This is the card component for the events in the feed
 */

import React, {useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";

export const Card = (props) => {
    const event = props.event;
    const start = parseDate(event.startDateTime.toDate());
    const end = parseDate(event.endDateTime.toDate());

    // TODO: Fetch attendees from redux and make sure front end updates

    const Tag = (props) => {
        return (
            <View style={styles.tags}>
                <Text>{props.tag}</Text>
            </View>
        )
    }

    return (
      <View style={styles.card}>
          <View style={styles.eventDetails}>
              <Text style={styles.eventName}>{event.name}</Text>
              <View style={styles.eventDate}>
                  <Text style={styles.eventDay}>{start.day}</Text>
                  <Text style={styles.eventTime}>{`${start.ampmTime} - ${end.ampmTime}`}</Text>
              </View>
          </View>
          <View style={styles.peopleGoingAndTagsContainer}>
              <View style={styles.peopleGoingContainer}>
                  {/*<Text style={styles.peopleGoing}>{event.attendees.length} people going</Text>*/}
              </View>
              <View style={styles.tagsContainer}>
                  {(event.tags[0] != null) && <Tag tag={event.tags[0]}/>}
                  {(event.tags[1] != null) && <Tag tag={event.tags[1]}/>}
                  {(event.tags[2] != null) && <Tag tag={event.tags[2]}/>}
            </View>
        </View>
    </View>
    )
}

export const getWeekDay = (dateObject) => {
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

export const getMonthName = (dateObject) => {
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

export const parseDate = (dateObject) => {
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
