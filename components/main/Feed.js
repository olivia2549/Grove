/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useState} from "react";
import { View, Text } from "react-native";

import firebase from 'firebase';
const db = firebase.firestore();

import { Card } from './Card';

// function to filter the posts
// there will be card components within the view. The card components will be clickable
// clicking it will redirect the user to the Event page with the event descriptions passed down as props
const Feed = () => {
    let [posts, setPosts] = useState([]);

    db.collection('posts').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();    // grabs changes
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
        <View>
            <Card/>
        </View>
    );
}

export default Feed;
