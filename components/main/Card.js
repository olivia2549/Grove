/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Card.js
 * This is the card component for the events in the feed
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import firebase from "firebase";
import {
  parseDate,
  getMonthName,
  getWeekDay,
  fetchFromFirebase,
} from "../../shared/HelperFunctions";

export const Card = (props) => {
  const eventDisplayingID = props.id;
  const [eventDisplaying, setEventDisplaying] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [startDateString, setStartDateString] = useState("");

  // Fetch event, and set eventDisplaying
  useEffect(() => {
    fetchFromFirebase(eventDisplayingID, "events").then((data) => {
      setEventDisplaying(data.data());
      setIsLoading(false);
      console.log(eventDisplaying.name, eventDisplaying.attendees.length)
    });
    if (!isLoading) {
      setStartDateString(
          parseDate(eventDisplaying.startDateTime.toDate()).day + ", " +
          parseDate(eventDisplaying.startDateTime.toDate()).month + " " +
          parseDate(eventDisplaying.startDateTime.toDate()).date
      );
    }
  }, [isLoading, props.loading]);

  const Tag = (props) => {
    return (
      <View style={styles.tags}>
        <Text>{props.tag}</Text>
      </View>
    );
  };

  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.card}>
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{eventDisplaying.name}</Text>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>
                {startDateString}
              </Text>
              <Text style={styles.eventTime}>{`${
                parseDate(eventDisplaying.startDateTime.toDate()).ampmTime
              } - ${
                parseDate(eventDisplaying.endDateTime.toDate()).ampmTime
              }`}</Text>
            </View>
          </View>
          <View style={styles.peopleGoingAndTagsContainer}>
            <View style={styles.peopleGoingContainer}>
              <Text style={styles.peopleGoing}>
                {eventDisplaying.attendees.length} people going
              </Text>
            </View>
            <View style={styles.tagsContainer}>
              {eventDisplaying.tags[0] != null && (
                <Tag tag={eventDisplaying.tags[0]} />
              )}
              {eventDisplaying.tags[1] != null && (
                <Tag tag={eventDisplaying.tags[1]} />
              )}
              {eventDisplaying.tags[2] != null && (
                <Tag tag={eventDisplaying.tags[2]} />
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#5DB075",
    padding: 15,
    marginBottom: 20,
    fontFamily: "Verdana",
    shadowOffset: { width: 4, height: 8 },
    shadowColor: "#000",
    shadowOpacity: 0.15,
    elevation: 14,
    borderRadius: 24,
  },
  eventDetails: {
    // wraps eventName and eventDate
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  eventName: {
    flex: 2 / 3,
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 24,
  },
  eventDate: {
    // wraps eventDay and eventTime
    flex: 1 / 3,
    alignItems: "flex-end",
    flexDirection: "column",
    marginBottom: 60,
  },
  eventDay: {
    textAlign: "right",
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 18,
  },
  eventTime: {
    textAlign: "right",
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 12,
  },
  peopleGoingAndTagsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  peopleGoingContainer: {
    flex: 1 / 2,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  peopleGoing: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
  tagsContainer: {
    flex: 1 / 2,
    alignItems: "flex-end",
    flexDirection: "row-reverse",
    flexWrap: "wrap",
  },
  tags: {
    backgroundColor: "#F6F6F6",
    padding: 5,
    margin: 5,
    borderRadius: 8,
  },
});

export default Card;
