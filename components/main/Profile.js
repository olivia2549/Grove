/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Profile.js
 * Create/edit user profile
 */

import React, { useState, useEffect } from "react";
import {StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity, Platform} from "react-native";

import { useSelector, useDispatch } from "react-redux";

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
        backgroundColor: "white"
        // padding: 16
    },
})

export const Profile = (props) => {
    const [user, setUser] = useState(null);
    const currentUser = useSelector((state) => state.currentUser);
    const dispatch = useDispatch();

    const signOut = () => {
        firebase.auth().signOut();
        dispatch(clearData());
    };

    // Load user, and if different than current user, fetch from database
    useEffect(() => {
        // If the uid to display is the current user, our job is easy
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
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
                .orderBy("creation", "asc") // ascending order by creation date
                .get()
                .then((snapshot) => {
                    // Iterate through everything in the snapshot and build a posts array
                    let postsArr = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }  // the object to place in the posts array
                    });
                })
                .catch((error) => {console.log(error)})
        }
    }, [props.route.params.uid])    // Only calls useEffect when uid changes (makes app faster)

    if (user === null) {
        return <View/>
    }

    return (
        <View style={styles.screenContainer}>
            <View style={{flex: 1, backgroundColor: "#5DB075", justifyContent: "center"}}>
                <Text style={{textAlign: "center", fontWeight: "500", fontSize: 33, color: "white", marginBottom: 18}}>{user.name}</Text>
                
            </View>
            
            {/* <Image 
                source={require('../../assets/fakeprofile.jfif')}  
                style={{width: 90, height: 90, borderRadius: 400/2, marginLeft: 15, marginTop: -45, backgroundColor: "white"}} 
                /> */}

            <View style={{flex: Platform.OS === 'ios' ? 0 : 4, backgroundColor: "white"}}>
                
                <View style={styles.containerInfo}>
                    
                    <Text>{user.email}</Text>
                </View>
                <View style={styles.containerGallery}>
                    <FlatList
                        numColumns={3}
                        horizontal={false}
                        renderItem={({item}) => (
                            <View style={styles.containerImage}>
                                <Image style={styles.image} source={{uri: item.downloadURL}}/>
                            </View>
                        )}
                    />
                </View> 
            </View>

           
            {/* <Button style={{}} title="Sign Out" onPress={signOut}/> */}

            
            
            {/* <View style={{padding: 15}}> */}
                <TouchableOpacity onPress={signOut} style={{ width: "90%", marginLeft: 18, marginBottom: 6, height: "4%", backgroundColor: "#5DB075", borderRadius: 20}}>
                    <Text style={{textAlign:"center", marginTop: 5, color: "white"}}>Sign Out</Text>
                </TouchableOpacity>
            {/* </View> */}

            
        </View>
    );
}

export default Profile;
