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
    const [posts, setPosts] = useState([]);

    firebase.firestore().collection('posts').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            let temp = posts;
            if (change.type === 'added') {
                temp.push(change.doc.data());
                setPosts(temp);
            } else if (change.type === 'removed') {
                setPosts(temp.filter(post => post.id !== change.doc.data().id));
            }
        })
    });

    console.log(posts);

    return (
      <View style={{backgroundColor: "#fff"}}>
        <View style={{justifyContent: "center", margin: 15}}>
            <FlatList
                data={posts}
                renderItem={({ post }) => (
                    // when the card is pressed, we head to EventDetails page
                    <TouchableOpacity onPress={() => navigation.navigate("EventDetails",{
                        post: post
                    })}>
                    <Card
                        post={post}
                    />
                        Hello
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
      </View>
    );
}

export default Feed;
