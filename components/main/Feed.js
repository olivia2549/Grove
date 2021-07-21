/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { View, FlatList, Text, TouchableOpacity, RefreshControl, Button, SafeAreaView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FancyInput } from "../styling";

import firebase from "firebase";

import { Card } from './Card';

//waiting for feed to refresh
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

// function to filter the events
// there will be card components within the view. The card components will be clickable
// clicking it will redirect the user to the Event page with the event descriptions passed down as props
const Feed = () => {
    const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    //refreshes feed if pulled up
    const onRefresh = React.useCallback(() => {
        //TODO - reload new data from firebase
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
      }, []);

      //returns events user searched for
      const searchEvents = (search) => {
            search = search.toLowerCase();
            firebase.firestore()
                .collection("events")
                .orderBy('nameLowercase')
                .startAt(search)
                .endAt(search + '\uf8ff')
                // .where('name', '>=', search) // username == search, or has search contents plus more chars
                .get()
                .then((snapshot) => {
                    let eventsArr = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data}  // the object to place in the users array
                    });
                    setEvents(eventsArr);
                })
    }

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

    // Fetches each event in the database (just once)
    useEffect(() => {
        firebase.firestore().collection('events').get().then(snapshot => {
            const temp = [];
            snapshot.forEach(doc => {
                temp.push(doc.data());
            })
            setEvents(temp);
        });
    }, []);

    return (
        <View style={{backgroundColor: "#fff"}}>
            <View style={{marginTop: 30}}>
                <FancyInput placeholder="Search..." onChangeText={(search) => {searchEvents(search)}}/>
            </View>
            <View style={{justifyContent: "center", margin: 15}}>
                {events.length === 0 ?
                    <Text>Nothing to show</Text> :
                    <FlatList
                        data={events}
                        refreshControl={
                            <RefreshControl
                              refreshing={refreshing}
                              onRefresh={onRefresh}
                            />
                          }
                        renderItem={(event) => (
                            // when the card is pressed, we head to EventDetails page
                            <TouchableOpacity onPress={() => navigation.navigate("EventDetails", {
                                event: event
                            })}>
                                <Card
                                    event={event.item}
                                />
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />}
            </View>
        </View>
    );
}

export default Feed;
