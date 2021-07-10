/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { View, FlatList } from "react-native";
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

      <View style={{backgroundColor: "#fff"}}>  
        <Container>
            <FlatList
                data={posts}
                renderItem={({ post }) => (
                    <Card
                        content={post}
                    />
                )}
                showsVerticalScrollIndicator={false}
            />
        </Container>
      </View>

    );
}

export default Feed;
