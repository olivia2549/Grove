/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { View, FlatList, Text, TouchableOpacity, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';

import firebase from "firebase";

import { Card } from './Card';

// function to filter the posts
// there will be card components within the view. The card components will be clickable
// clicking it will redirect the user to the Event page with the event descriptions passed down as props
const Feed = () => {
    const navigation = useNavigation();
    // const [state, setState] = useState({ posts: [] })
    const [posts, setPosts] = useState([]);

    const POSTS = [
        {
            eventName: "Coding with Sybbure",
            eventDetail: "Come code with all the bad boys and girls as we prepare to get our FAANG internships.",
            eventDay: "Mon, Aug 7",
            eventTime: "10:00am-12:00pm",
            peopleGoing: 23,
            tags: ["Coding Clubs", "Free Food"],
        },
        {
            eventName: "Coding with Sybbure",
            eventDetail: "Come code with all the bad boys and girls as we prepare to get our FAANG internships.",
            eventDay: "Mon, Aug 7",
            eventTime: "10:00am-12:00pm",
            peopleGoing: 23,
            tags: ["Coding Clubs", "Free Food"],
        },
        {
            eventName: "Coding with Sybbure",
            eventDetail: "Come code with all the bad boys and girls as we prepare to get our FAANG internships.",
            eventDay: "Mon, Aug 7",
            eventTime: "10:00am-12:00pm",
            peopleGoing: 23,
            tags: ["Coding Clubs", "Free Food"],
        }
    ]

    // useEffect(() => {
    //     firebase.firestore()
    //         .collection("posts")
    //         .get()
    //         .then((snapshot) => {
    //             let temp = state.posts;
    //             console.log("Total posts: ", snapshot.size);
    //             snapshot.forEach(doc => {
    //                 temp.push(doc.data());
    //             })
    //             setState({posts: temp});
    //         })
    //         .catch((error) => {console.log(error)})
    //     console.log(state.posts[0].name);
    // }, [state])

    // useEffect(() => {
    //     firebase.firestore().collection('posts').onSnapshot(snapshot => {
    //         let changes = snapshot.docChanges();
    //         changes.forEach(change => {
    //             let temp = state.posts;
    //             if (change.type === 'added') {
    //                 temp.push(change.doc);
    //                 setPosts(temp);
    //             } else if (change.type === 'removed') {
    //                 setPosts(temp.filter(post => post.id !== change.doc.id));
    //             }
    //         })
    //     })
    // }, [posts])
    //
    // console.log(posts[0].name);

    return (
      <View style={{backgroundColor: "#fff"}}>  
        <View style={{justifyContent: "center", margin: 15}}>
            <FlatList
                data={POSTS}
                renderItem={({ item }) => (
                    // when the card is pressed, we head to EventDetails page
                    <TouchableOpacity onPress={() => navigation.navigate("EventDetails",{
                        eventName: item.eventName,
                        eventDetail: item.eventDetail,
                        eventDay: item.eventDay,
                        eventTime: item.eventTime,
                        peopleGoing: item.peopleGoing,
                        tags: item.tags,
                    })}>
                    <Card
                        eventName={item.eventName}
                        eventDay={item.eventDay}
                        eventTime={item.eventTime}
                        peopleGoing={item.peopleGoing}
                        tags={item.tags}
                    />
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
      </View>
    );
}

export default Feed;
