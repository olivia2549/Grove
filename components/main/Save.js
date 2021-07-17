/**
 * WE DON'T USE THIS
 * Copyright Grove, @2021 - All rights reserved
 *
 * Save.js
 * Save posts to firebase
 */

import React, {useState} from "react";
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, Image, Button } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export const Save = (props) => {
    const navigation = useNavigation();
    const [caption, setCaption] = useState("");

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({  // add a new doc aka post to firebase
                downloadURL: downloadURL,
                caption: caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => { navigation.popToTop() })    // returns to the main page, clearing navigation stack
    }

    const saveImage = async () => {
        const uri = props.route.params.image;
        const childPath = `posts/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase.storage().ref().child(childPath).put(blob);

        // Shows to console how many bytes have uploaded to firebase, one snapshot at a time
        const taskProgress = (snapshot) => {
            console.log(`transferred: ${snapshot.bytesTransferred}`);
        }

        // Log to the console any errors
        const taskError = (snapshot) => {
            console.log(snapshot);
        }

        // When download completes, it gets URL that's accessible for other app users to see post
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then(snapshot => {
                savePostData(snapshot);
            });
        }

        // When state changes, call all the task functions defined above
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    return (
        <View style={{flex: 1}}>
            {/* uri is passed in as props and comes from the image picker in AddEventInfo.js */}
            <Image source={{uri: props.route.params.image}} style={{ width: 200, height: 200 }}/>
            <TextInput
                placeholder="Write a caption"
                onChangeText={(caption) => setCaption(caption)}
            />

            {/*Save the post to firestore*/}
            <Button title="Save" onPress={() => saveImage()}/>
        </View>
    )
}

export default Save;
