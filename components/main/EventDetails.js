/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * EventDetails.js
 * Displays the details of an event
 */

import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	Platform,
	KeyboardAvoidingView, Image, Button, FlatList,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { InviteFriends } from "./InviteFriends";
import { ProfileUser } from "./ProfileUser";
import firebase from "firebase";
import { FancyInput } from "../styling";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {parseDate, getMonthName, getWeekDay, fetchFromFirebase } from "../../shared/HelperFunctions";


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// function to provide details about each event/card that is present in the feed page
export const EventDetails = ({ navigation, route }) => {
	const currentUserID = firebase.auth().currentUser.uid;
    const currentUserRef = firebase.firestore().collection("users").doc(currentUserID);

	const eventDisplayingID = route.params.ID;
	const [eventDisplaying, setEventDisplaying] = useState({});

	const [attendees, setAttendees] = useState([]);

	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingAttendees, setIsLoadingAttendees] = useState(true);

	const [goingBtnText, setGoingBtnText] = useState("I'm interested");

	// Fetch event, and set eventDisplaying
	useEffect(() => {
        if (isLoading) {
            fetchFromFirebase(eventDisplayingID, "events").then((data) => {
                setEventDisplaying(data.data()); 
                setIsLoading(false);
            });
        }
	}, [isLoading]);

	useEffect(() => {
		if (isLoadingAttendees && !isLoading) {
			console.log("loading attendees...");
			const temp = [];
			eventDisplaying.attendees.forEach(async (attendee) => {
				const doc = await attendee.get();
				temp.push(doc.data());
			});
			setAttendees(temp);
			setIsLoadingAttendees(false);
		}
	}, [isLoadingAttendees, isLoading]);

	const [interestedColor, setInterestedColor] = useState("#5DB075");

	// title font size
	const [currentFont, setCurrentFont] = useState(50);

	// Goes back to feed when user swipes down from top
	const onSwipeDown = (gestureState) => {
		navigation.goBack();
	};

	// When the "i'm interested" button is pressed
	const onInterested = () => {
		// add current user to "attendees" array of eventDisplaying
        const eventRef = firebase.firestore().collection("events").doc(eventDisplayingID);
        eventRef.update({
            attendees: firebase.firestore.FieldValue.arrayUnion(currentUserRef)
        });
		goingBtnText.equals("I'm interested") ? setGoingBtnText("Going!") : setGoingBtnText("I'm interested");
    };

	const config = {
		velocityThreshold: 0.3,
		directionalOffsetThreshold: 80,
	};

	if (isLoading) return <Text>Loading...</Text>;

	return (
		<View style={styles.container}>
			<GestureRecognizer
				onSwipeDown={(state) => onSwipeDown(state)}
				config={config}
				style={styles.topBar}
			>
				<Text
					adjustsFontSizeToFit
					style={[styles.eventName, { fontSize: currentFont }]}
					onTextLayout={(e) => {
						const { lines } = e.nativeEvent;
						if (lines.length > 1) {
							setCurrentFont(currentFont - 1);
						}
					}}
				>
					{eventDisplaying.name}
				</Text>
			</GestureRecognizer>

			<ScrollView style={{ flex: Platform.OS === "ios" ? 0 : 7 }}>
				<View style={styles.rowFlexContainer}>
					{eventDisplaying.tags.map((tag) => (
						<View style={styles.tagBox}>
							<Text style={styles.tagText}>{tag}</Text>
						</View>
					))}
				</View>
				<View style={styles.descriptionContainer}>
					<Text style={styles.descriptionText}>
						{eventDisplaying.description}
					</Text>
				</View>

				<View style={styles.bigView}>
					{/* WHERE */}
					<View style={styles.rowFlexContainer}>
						<Text style={styles.whereWhen}>Where</Text>
						<View style={styles.locationView}>
							{/* this is hard coded, would need to be changed once we fetch info from the data */}
							<Text style={styles.locationText}>
								{eventDisplaying.location}
							</Text>
						</View>
					</View>

					{/* START */}
					<View style={styles.timeView}>
						<Text style={styles.startText}>Starts</Text>

						<View style={styles.startView}>
							<Text style={styles.startDayText}>{parseDate(eventDisplaying.startDateTime.toDate()).day}</Text>
						</View>
						<View style={styles.startTimeView}>
							<Text style={styles.startTimeText}>
								{parseDate(eventDisplaying.startDateTime.toDate()).ampmTime}
							</Text>
						</View>
					</View>

					{/* END */}
					<View style={styles.timeView}>
						<Text style={styles.endsText}>Ends</Text>
						<View style={styles.endDayView}>
							<Text style={styles.endDayText}>{parseDate(eventDisplaying.endDateTime.toDate()).day}</Text>
						</View>
						<View style={styles.endTimeView}>
							<Text style={styles.endTimeText}>
								{parseDate(eventDisplaying.endDateTime.toDate()).ampmTime}
							</Text>
						</View>
					</View>
				</View>

				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardAvoidContainer}
				>
					<Text style={styles.peopleGoingText}>People Going ({attendees.length})</Text>
					{
						isLoadingAttendees ?
							<Text>Loading...</Text>
							:
							<FlatList
								numColumns={1}
								horizontal={false}
								data={attendees}
								renderItem={({item}) => (   // Allows you to render a text item for each user
									<View style={styles.userCellContainer}>
										<TouchableOpacity
											onPress={() => navigation.navigate("ProfileUser", { uid: item.ID })}
										>
											<Image
												source={require("../../assets/profileicon.jpg")}
												style={styles.profilePic}
											/>
											<Text style={styles.userName}>{item.name}</Text>
										</TouchableOpacity>
									</View>
								)}
							/>
					}
				</KeyboardAvoidingView>
			</ScrollView>

			<View style={styles.rowFlexContainer}>
				{/*Invite button*/}
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("InviteFriends", {
							ID: eventDisplayingID,
						})
					}
					style={styles.fancyButtonContainer}
				>
					<Text style={styles.fancyButtonText}>Invite</Text>
				</TouchableOpacity>

				{/*I'm Interested button*/}
				<TouchableOpacity
					onPress={onInterested}
					style={[
						styles.fancyButtonContainer,
						{ backgroundColor: interestedColor, flex: 2 / 3 },
					]}
				>
					<Text style={styles.fancyButtonText}>{goingBtnText}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	topBar: {
		backgroundColor: "#5DB075",
		width: "100%",
		justifyContent: "center",
		flex: 1, // Platform.OS === "ios" ? 0.7 : 1
	},
	tagBox: {
		height: windowHeight * 0.07,
		backgroundColor: "lightgrey",
		marginLeft: 15,
		borderRadius: 10,
		justifyContent: "center",
		padding: 13,
		marginTop: 10,
	},

	// for event details
	eventName: {
		color: "#ffffff",
		fontWeight: "600",
		padding: 20,
	},
	scrollable: {
		flex: 7,
	},
	// for Share and I'm Going Buttons
	buttonContainer: {
		flexDirection: "row",
		alignItems: "flex-end",
		top: "130%",
	},
	fancyButtonContainer: {
		elevation: 8,
		backgroundColor: "#5DB075",
		borderRadius: 100,
		paddingVertical: 16,
		paddingHorizontal: 32,
		marginBottom: 20,
		marginLeft: 10,
		marginRight: 10,
		flex: 1 / 3,
		justifyContent: "center",
	},
	fancyButtonText: {
		fontSize: 18,
		color: "#fff",
		fontWeight: "bold",
		alignSelf: "center",
		textTransform: "uppercase",
		textAlign: "center",
	},
	tagText: {
		color: "black",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: windowWidth * 0.05,
	},
	whereWhen: {
		fontSize: windowWidth * 0.06,
		fontWeight: "bold",
		marginTop: 3,
		// marginBottom: windowHeight * 0.015,
	},
	locationView: {
		flex: 1,
		marginLeft: windowWidth * 0.02,
		justifyContent: "center",
		height: windowHeight * 0.055,
		backgroundColor: "lightgrey",
		borderRadius: 10,
	},
	locationText: {
		marginLeft: windowWidth * 0.03,
		color: "black",
		fontSize: windowWidth * 0.05,
	},
	timeView: {
		flexDirection: "row",
		marginTop: 6,
		marginLeft: 1,
	},
	scrollStyle: {
		flex: Platform.OS === "ios" ? 0 : 7, //
	},
	descriptionContainer: {
		padding: windowWidth * 0.05,
	},
	descriptionText: {
		fontSize: windowWidth * 0.07,
	},
	bigView: {
		justifyContent: "center",
		padding: windowWidth * 0.05,
	},
	rowFlexContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	startText: {
		fontSize: windowWidth * 0.06,
		fontWeight: "bold",
		marginTop: 3,
	},
	startView: {
		flex: 1,
		marginLeft: 15,
		justifyContent: "center",
		height: windowHeight * 0.055,
		backgroundColor: "lightgrey",
		borderRadius: 10,
	},
	startDayText: {
		marginLeft: windowWidth * 0.03,
		color: "black",
		fontSize: windowWidth * 0.05,
	},
	startTimeView: {
		flex: 1,
		marginLeft: 15,
		justifyContent: "center",
		height: windowHeight * 0.055,
		backgroundColor: "lightgrey",
		borderRadius: 10,
	},
	startTimeText: {
		marginLeft: windowWidth * 0.03,
		color: "black",
		fontSize: windowWidth * 0.05,
	},
	endsText: {
		fontSize: windowWidth * 0.06,
		fontWeight: "bold",
		marginTop: 2,
	},
	peopleGoingText: {
		fontSize: windowWidth * 0.07,
		fontWeight: "bold",
		marginBottom: windowHeight * 0.01,
	},
	endDayView: {
		flex: 1,
		marginLeft: 25,
		justifyContent: "center",
		height: windowHeight * 0.055,
		backgroundColor: "lightgrey",
		borderRadius: 10,
	},
	endDayText: {
		marginLeft: windowWidth * 0.03,
		color: "black",
		fontSize: windowWidth * 0.05,
	},
	endTimeView: {
		flex: 1,
		marginLeft: 15,
		justifyContent: "center",
		height: windowHeight * 0.055,
		backgroundColor: "lightgrey",
		borderRadius: 10,
	},
	endTimeText: {
		marginLeft: windowWidth * 0.03,
		color: "black",
		fontSize: windowWidth * 0.05,
	},
	keyboardAvoidContainer: {
		justifyContent: "center",
		padding: windowWidth * 0.05,
		flex: 7,
	},
	userCellContainer: {
		margin: 5,
		flex: 1,
		// flexDirection: "row",
		// justifyContent: "center",
		// alignItems: "center",
	},
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

export default EventDetails;
