/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * UserImageName.js
 * Displays a user's image and name in a row
 */

import React, { useEffect, useState } from "react";
import { Text, Image, StyleSheet, Dimensions, View } from "react-native";
import { fetchFromFirebase } from "../../shared/HelperFunctions"; 

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const UserImageName = ({ id }) => {
    let [isLoading, setIsLoading] = useState(true);
    let [user, setUser] = useState(null);

    useEffect(() => {
        fetchFromFirebase(id, "users").then(data => {
            if (data.data()) {
				 setUser(data.data());
				 console.log(data.data());
			}
            setIsLoading(false);
        });
    }, [isLoading]);

    if (isLoading) return <Text>Loading...</Text>;

	return (
		<View>
			<Image
				source={require("../../assets/profileicon.jpg")}
				style={styles.profilePic}
			/>
			<Text style={styles.userName}>
				{user.name}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
    profilePic: {
		width: 45,
		height: 45,
		borderRadius: 400 / 2,
	},
	userName: {
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: 5,
		fontWeight: "bold",
		fontSize: windowWidth * 0.042,
	},
});

export default UserImageName;
