/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Add.js
 * Allows user to make a new post
 */

import React, { useState, useEffect } from 'react';
import { Button, Image, Text, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const Add = () => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                // Request permissions to access camera gallery
                const { galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                setHasGalleryPermission(galleryStatus !== 'granted');
            }
        })();
    }, []);

    if (hasGalleryPermission === false) {
        return <Text>Unable to access the camera gallery. Please grant permissions.</Text>;
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick Image from Camera Roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
    );
}

export default Add;
