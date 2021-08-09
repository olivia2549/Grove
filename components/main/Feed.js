/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  Button,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FancyInput } from "../styling";

import firebase from "firebase";

import { Card } from "./Card";

// Waiting for feed to refresh
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

/**
 * Feed - filters the events
 *
 * @details There are clickable card components within the view, sorted by upcoming by default.
 *          Clicking a card component redirects user to the EventDetails page with the id passed down as a prop
 */
const Feed = () => {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  const [eventsDisplaying, setEventsDisplaying] = useState([]);
  const [toggleSide, setToggleSide] = useState("flex-start");

  // Refreshes feed if pulled up
  const onRefresh = useCallback(() => {
    toggleSide === "flex-start"
      ? setLoadingUpcoming(true)
      : setLoadingPopular(true);
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // Fetches each event in the database sorted by attendees count
  useEffect(() => {
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snapshot) => {
        const temp = [];
        const date = new Date();
        snapshot.forEach((doc) => {
          if (date <= doc.data().startDateTime.toDate()) {
            temp.push(doc.data());
          }
        });
        if (temp.length > 1) {
          temp.sort((a, b) => b.attendees.length - a.attendees.length);
        }
        setEventsDisplaying(temp);
        setLoadingPopular(false);
      });
  }, [loadingPopular]);

  // Fetches each event in the database sorted by upcoming
  useEffect(() => {
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snapshot) => {
        const temp = [];
        const date = new Date();
        snapshot.forEach((doc) => {
          if (date <= doc.data().startDateTime.toDate()) {
            temp.push(doc.data());
          }
        });
        if (temp.length > 1) {
          temp.sort(
            (a, b) => a.startDateTime.toDate() - b.startDateTime.toDate()
          );
        }
        setEventsDisplaying(temp);
        setLoadingUpcoming(false);
      });
  }, [loadingUpcoming]);

  return (
    <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", top: 7 }}>Grove</Text>
      </View>

      {/* Toggle Button */}
      <TouchableOpacity
        style={[styles.toggleContainer, { justifyContent: toggleSide }]}
        onPress={() => {
          if (toggleSide === "flex-start") {
            setToggleSide("flex-end");
            setLoadingPopular(true);
          } else {
            setToggleSide("flex-start");
            setLoadingUpcoming(true);
          }
        }}
        activeOpacity="0.77"
      >
        {/* Upcoming pressed */}
        {toggleSide === "flex-start" && (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.upcomingEventsContainer}>
              <Text style={styles.toggleText}>Upcoming</Text>
            </View>
            <View style={styles.popularEventsGreyTextContainer}>
              <Text style={styles.popularEventsGreyText}>Popular</Text>
            </View>
          </View>
        )}

        {/* Popular pressed */}
        {toggleSide === "flex-end" && (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.upcomingEventsGreyTextContainer}>
              <Text style={styles.upcomingEventsGreyText}>Upcoming</Text>
            </View>
            <View style={styles.popularEventsContainer}>
              <Text style={styles.toggleText}>Popular</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      <View style={{ justifyContent: "center", margin: 15, flex: 1 }}>
        {eventsDisplaying.length === 0 ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={eventsDisplaying}
            keyExtractor={(item, index) => item.ID}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={(event) => (
              // when the card is pressed, we head to EventDetails page
              <TouchableOpacity
                key={event.item.ID}
                onPress={() =>
                  navigation.navigate("EventDetails", {
                    ID: event.item.ID,
                  })
                }
              >
                {toggleSide === "flex-start" ? (
                  <Card
                    key={event.item.ID}
                    id={event.item.ID}
                    loading={loadingUpcoming}
                  />
                ) : (
                  <Card
                    key={event.item.ID}
                    id={event.item.ID}
                    loading={loadingPopular}
                  />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* toggle button */
  toggleContainer: {
    // flex: 1 / 7,
    flexDirection: "row",
    marginHorizontal: windowWidth * 0.055,
    marginTop: 22,
    height: "7%",
    backgroundColor: "#ededed",
    borderRadius: 30,
    borderWidth: 0.3,
    borderColor: "grey",
  },
  upcomingEventsContainer: {
    // when upcoming button is clicked
    flex: 1,
    backgroundColor: "white",
    borderRadius: 30,
    height: "97%",
    justifyContent: "center",
  },
  popularEventsGreyTextContainer: {
    flex: 1,
    height: "97%",
    justifyContent: "center",
  },
  popularEventsGreyText: {
    color: "#BDBDBD",
    fontWeight: "500",
    fontSize: windowWidth * 0.04,
    textAlign: "center",
  },
  // when events added button is clicked
  popularEventsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 30,
    height: "97%",
    justifyContent: "center",
  },
  upcomingEventsGreyTextContainer: {
    flex: 1,
    height: "97%",
    justifyContent: "center",
  },
  upcomingEventsGreyText: {
    color: "#BDBDBD",
    fontWeight: "500",
    fontSize: windowWidth * 0.04,
    textAlign: "center",
  },

  toggleText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: windowWidth * 0.04,
    color: "#5DB075",
  },
});

export default Feed;

// //returns events user searched for
// const searchEvents = (search) => {
//     search = search.toLowerCase();
//     firebase
//         .firestore()
//         .collection("events")
//         .orderBy("nameLowercase")
//         .startAt(search)
//         .endAt(search + "\uf8ff")
//         // .where('name', '>=', search) // username == search, or has search contents plus more chars
//         .get()
//         .then((snapshot) => {
//             let eventsArr = snapshot.docs.map((doc) => {
//                 const data = doc.data();
//                 const id = doc.id;
//                 return { id, ...data }; // the object to place in the users array
//             });
//             setEvents(eventsArr);
//         });
// };
