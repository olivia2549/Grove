/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { FlatList, Button } from "react-native";
import { Container } from "../styling";

import firebase from "firebase";

import { Card } from './Card';
import {clearData} from "../../redux/actions";
import {useDispatch} from "react-redux";

// function to filter the posts
// there will be card components within the view. The card components will be clickable
// clicking it will redirect the user to the Event page with the event descriptions passed down as props
const Feed = () => {
    const dispatch = useDispatch();

    const [posts, setPosts] = useState([]);

    firebase.firestore().collection('posts').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            let temp = posts;
            if (change.type === 'added') {
                temp.push(change.doc);
                setPosts(temp);
            } else if (change.type === 'removed') {
                setPosts(temp.filter(post => post.id !== change.doc.id));
            }
        })
    })

    return (
        <Container>
            <FlatList
                data={posts}
                renderItem={({ post }) => (
                    <Card
                        content={post}
                    />
                )}
            />
        </Container>
    );
}

export default Feed;



// const POSTS = [
//     {
//         eventName: "Club Spikeball",
//         eventDay: "Wed, Aug 7",
//         eventTime: "4:00pm-6:00pm",
//         peopleGoing: 23,
//         tags: ["Free food","Sports","Anyone Welcome"]
//     },
//     {
//         eventName: "Interfaith Council Dialogue Dinner",
//         eventDay: "Today, Aug 5",
//         eventTime: "4:00pm-6:00pm",
//         peopleGoing: 33,
//         tags: ["Free food","Clubs","Anyone Welcome"]
//     },
//     {
//         eventName: "Change++ Speaker Event",
//         eventDay: "Tomorrow, Aug 6",
//         eventTime: "4:00pm-6:00pm",
//         peopleGoing: 50,
//         tags: ["Coding Clubs","Invite Only"]
//     },
//     {
//         eventName: "Change++ Speaker Event",
//         eventDay: "Tomorrow, Aug 6",
//         eventTime: "4:00pm-6:00pm",
//         peopleGoing: 50,
//         tags: ["Coding Clubs","Invite Only"]
//     }
// ]
