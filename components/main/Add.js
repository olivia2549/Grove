/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Add.js
 * Allows user to make a new post
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, View, TextInput, Platform } from 'react-native';

export const Add = () => {
    const navigation = useNavigation();

    const [state, setState] = useState({
        eventName: "",
        eventDescription: "",
    });
    let [error, setError] = useState("");

    const onChange = (ev) => {
        setError("");
        setState({[ev.target.name]: ev.target.value});
    };

    return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Create Event</Text>

                <TextInput
                    id="eventName"
                    name="eventName"
                    onChange={onChange}
                    placeholder="Event Name..."
                    value={state.eventName}
                />

                <Button title="Next" onPress={() => onChange}/>
            </View>
    );
}

export default Add;
// import * as ImagePicker from 'expo-image-picker';
//
// export const Add = () => {
//     const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
//     const [image, setImage] = useState(null);
//     const navigation = useNavigation();
//
//     useEffect(() => {
//         (async () => {
//             if (Platform.OS !== 'web') {
//                 // Request permissions to access camera gallery
//                 const { galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//                 setHasGalleryPermission(galleryStatus !== 'granted');
//             }
//         })();
//     }, []);
//
//     if (hasGalleryPermission === false) {
//         return <Text>Unable to access the camera gallery. Please grant permissions.</Text>;
//     }
//
//     const pickImage = async () => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//         });
//
//         if (!result.cancelled) {
//             setImage(result.uri);
//         }
//     };
//
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Button title="Pick Image from Camera Roll" onPress={pickImage} />
//
//             {/*// Navigate to 'Save' component, passing the image as a prop */}
//             <Button title="Save" onPress={() => navigation.navigate('Save', {image})}/>
//             {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//         </View>
//     );
// }
//
// export default Add;
