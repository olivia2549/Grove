/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Profile.js
 * Create/edit user profile
 */

import React, { useState, useEffect } from "react";
import {StyleSheet, View, Text, Image, FlatList, Button} from "react-native";

import { useSelector } from "react-redux";

import firebase from "firebase";
import {USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE} from "../../redux/constants";
import {clearData} from "../../redux/actions";
require ('firebase/firestore');

const styles = StyleSheet.create({
    containerInfo: {
        margin: 20,
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1
    },
    screenContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 16
    },
})

export const Profile = (props) => {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const currentUser = useSelector((state) => state.currentUser);
    const currentUserPosts = useSelector(state => state.currentUser.posts);

    const signOut = () => {
        firebase.auth().signOut();
        dispatch(clearData());
    };

    // Load user, and if different than current user, fetch from database
    useEffect(() => {
        // If the uid to display is the current user, our job is easy
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPosts(currentUserPosts);
        }
        // Otherwise, we need to grab a different user and their posts from firebase
        else {
            // This is essentially 'fetchUser' from actions/index.js but doesn't change state of application
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)    // This time, grab the uid from what was passed in as a props param
                .get()
                .then((snapshot) => {
                    // if the user exists, change the user state
                    if (snapshot.exists) {
                        // Set user to display onscreen
                        setUser(snapshot.data());
                    }
                    else {
                        console.log("User does not exist.")
                    }
                })
                .catch((error) => {console.log(error)})

            // This is essentially 'fetchUserPosts' from actions/index.js but doesn't change state of application
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)    // This time, grab the uid from what was passed in as a props param
                .collection("userPosts")    // fetch everything in the collection
                .orderBy("creation", "asc") // ascending order by creation date
                .get()
                .then((snapshot) => {
                    // Iterate through everything in the snapshot and build a posts array
                    let postsArr = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }  // the object to place in the posts array
                    });
                    setUserPosts(postsArr);
                })
                .catch((error) => {console.log(error)})
        }
    }, [props.route.params.uid])    // Only calls useEffect when uid changes (makes app faster)

    if (user === null) {
        return <View/>
    }

    return (
        <View style={styles.screenContainer}>

            <Button title="Sign Out" onPress={signOut}/>

            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <Image style={styles.image} source={{uri: item.downloadURL}}/>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

export default Profile;
