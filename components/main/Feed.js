/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Feed.js
 * Displays main feed
 */

import React, {useEffect, useState} from "react";
import { View, FlatList, Text } from "react-native";
import { Container } from "../styling";

import firebase from "firebase";

import { Card } from './Card';

// function to filter the posts
// there will be card components within the view. The card components will be clickable
// clicking it will redirect the user to the Event page with the event descriptions passed down as props
const Feed = () => {
    const [state, setState] = useState({ posts: [] })
    // const [posts, setPosts] = useState([]);

    // firebase.firestore().collection('posts').onSnapshot(snapshot => {
    //     let changes = snapshot.docChanges();
    //     changes.forEach(change => {
    //         let temp = state.posts;
    //         if (change.type === 'added') {
    //             temp.push(change.doc);
    //             setState({posts: temp});
    //         } else if (change.type === 'removed') {
    //             setState({posts: temp.filter(post => post.id !== change.doc.id)});
    //         }
    //     })
    //     console.log(state.posts[0].name);
    // })

    // firebase.firestore().collection('posts').onSnapshot(snapshot => {
    //     let changes = snapshot.docChanges();
    //     changes.forEach(change => {
    //         if (change.type === 'added') {
    //             setPosts(prevPosts => {
    //                 prevPosts.push(change.doc);
    //                 return prevPosts;
    //             });
    //         } else if (change.type === 'removed') {
    //             setPosts(prevPosts => {
    //                 prevPosts.filter(post => post.id !== change.doc.id)
    //                 return prevPosts;
    //             });
    //         }
    //     })
    // })

    firebase.firestore()
        .collection("posts")
        .get()
        .then((snapshot) => {
            let temp = state.posts;
            console.log("Total posts: ", snapshot.size);
            snapshot.forEach(doc => {
                temp.push(doc.data());
            })
            setState({posts: temp});
            console.log(state.posts[0].name);
        })
        .catch((error) => {console.log(error)})

    return (
        <Container>
            {/*<FlatList*/}
            {/*    data={posts}*/}
            {/*    renderItem={({ post }) => (*/}
            {/*        <Card/>*/}
            {/*    )}*/}
            {/*    showsVerticalScrollIndicator={false}*/}
            {/*/>*/}
        </Container>
    );
}

export default Feed;
