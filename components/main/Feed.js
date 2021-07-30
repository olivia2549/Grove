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

//waiting for feed to refresh
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// function to filter the events
// there will be card components within the view. The card components will be clickable
// clicking it will redirect the user to the Event page with the event descriptions passed down as props
const Feed = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]); // for normal upcoming events
  const [popularEventsContent, setPopularEventsContent] = useState([]); // for popular events
  const [refreshing, setRefreshing] = useState(false);

  //for toggle button
  const [upComingEvents, setUpComingEvents] = useState(true);
  const [popularEvents, setPopularEvents] = useState(false);
  const [toggleSide, setToggleSide] = useState("flex-start");

  const flipToggle = () => {
    if (upComingEvents) {
      setToggleSide("flex-end");
    } else if (popularEvents) {
      setToggleSide("flex-start");
    }
    setUpComingEvents(!upComingEvents);
    setPopularEvents(!popularEvents);
  };

  // Fetches each event in the database (when page first loads)
  useEffect(
    () => {
      firebase
        .firestore()
        .collection("events")
        .get()
        .then((snapshot) => {
          const temp = [];
          const date = new Date();
          snapshot.forEach((doc) => {
            if (date <= doc.data().startDateTime.toDate()) {
              // console.log("here:" + date - doc.data().startDateTime.toDate());
              temp.push(doc.data());
            }
            // console.log("date: " + doc.data().startDateTime.toDate());
          });
          if (temp.length > 1) {
            // temp.forEach((i) => console.log(i.startDateTime.toDate()));
            // console.log(temp[0].startDateTime.toDate());
            temp.sort(
              (a, b) => a.startDateTime.toDate() - b.startDateTime.toDate()
            );
          }
          setEvents(temp);
        });
    },
    // sortEvents(),
    []
  );

  //refreshes feed if pulled up
  const onRefresh = useCallback(() => {
    console.log(events);
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snapshot) => {
        const temp = [];
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
        setEvents(temp);
      });

    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  //returns events user searched for
  const searchEvents = (search) => {
    search = search.toLowerCase();
    firebase
      .firestore()
      .collection("events")
      .orderBy("nameLowercase")
      .startAt(search)
      .endAt(search + "\uf8ff")
      // .where('name', '>=', search) // username == search, or has search contents plus more chars
      .get()
      .then((snapshot) => {
        let eventsArr = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data }; // the object to place in the users array
        });
        setEvents(eventsArr);
      });
  };

  // this continuously checks for updates from the db
  // firebase.firestore().collection('events').onSnapshot(snapshot => {
  //     let changes = snapshot.docChanges();
  //     changes.forEach(async change => {
  //         let temp = events;
  //         if (change.type === 'added') {
  //             temp.push(change.doc.data());
  //             setEvents(temp);
  //         } else if (change.type === 'removed') {
  //             setEvents(temp.filter(event => event.id !== change.doc.data().id));
  //         }
  //     });
  // });

  const createPopularEvents = () => {
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
          //   temp.forEach((i) => console.log(i.attendees.length));
          temp.sort((a, b) => b.attendees.length - a.attendees.length);
        }
        setPopularEventsContent(temp);
      });
  };

  const onPopularRefresh = useCallback(() => {
    console.log(events);
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snapshot) => {
        const temp = [];
        snapshot.forEach((doc) => {
          if (date <= doc.data().startDateTime.toDate()) {
            temp.push(doc.data());
          }
        });
        if (temp.length > 1) {
          temp.sort((a, b) => b.attendees.length - a.attendees.length);
        }
        setEvents(temp);
      });

    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // popular events
  if (popularEvents) {
    createPopularEvents();
    return (
      <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 32, fontWeight: "bold", top: 7 }}>
            Grove
          </Text>
        </View>
        {/* Toggle Button */}
        <TouchableOpacity
          style={[styles.toggleContainer, { justifyContent: toggleSide }]}
          onPress={flipToggle}
          activeOpacity="0.77"
        >
          {/* upcoming events pressed */}
          {upComingEvents && (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={styles.upcomingEventsContainer}>
                <Text style={styles.toggleText}>Upcoming</Text>
              </View>
              <View style={styles.popularEventsGreyTextContainer}>
                <Text style={styles.popularEventsGreyText}>Popular</Text>
              </View>
            </View>
          )}

          {/* events attended pressed */}
          {popularEvents && (
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

        <View style={{ justifyContent: "center", margin: 15 }}>
          {events.length === 0 ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={popularEventsContent}
              keyExtractor={(item, index) => item.ID}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onPopularRefresh}
                />
              }
              renderItem={(event) => (
                // when the card is pressed, we head to EventDetails page
                <TouchableOpacity
                  key={event.id}
                  onPress={() =>
                    navigation.navigate("EventDetails", {
                      ID: event.item.ID,
                    })
                  }
                >
                  <Card key={event.item.ID} id={event.item.ID} />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  // upcoming events
  return (
    <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
      {/* <View style={{marginTop: 30}}>
                <FancyInput placeholder="Search..." onChangeText={(search) => {searchEvents(search)}}/>
            </View> */}
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", top: 7 }}>Grove</Text>
      </View>
      {/* Toggle Button */}
      <TouchableOpacity
        style={[styles.toggleContainer, { justifyContent: toggleSide }]}
        onPress={flipToggle}
        activeOpacity="0.77"
      >
        {/* upcoming events pressed */}
        {upComingEvents && (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.upcomingEventsContainer}>
              <Text style={styles.toggleText}>Upcoming</Text>
            </View>
            <View style={styles.popularEventsGreyTextContainer}>
              <Text style={styles.popularEventsGreyText}>Popular</Text>
            </View>
          </View>
        )}

        {/* events attended pressed */}
        {popularEvents && (
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

      <View style={{ justifyContent: "center", margin: 15 }}>
        {events.length === 0 ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item, index) => item.ID}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={(event) => (
              // when the card is pressed, we head to EventDetails page
              <TouchableOpacity
                key={event.id}
                onPress={() =>
                  navigation.navigate("EventDetails", {
                    ID: event.item.ID,
                  })
                }
              >
                <Card key={event.item.ID} id={event.item.ID} />
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
    height: 30,
  },

  // when upcoming button is clicked
  upcomingEventsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 30,
    height: "97%",
    justifyContent: "center",
    // flexDirection: "row",
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
