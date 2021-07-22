/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * ProfileUser.js
 * Profile page for someone you're following
 */

import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Platform,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

// firebase imports
import firebase from "firebase";
import {
    USER_POSTS_STATE_CHANGE,
    USER_STATE_CHANGE,
} from "../../redux/constants";
import {clearData, fetchUserOutgoingRequests} from "../../redux/actions";
import {Card} from "./Card";
require("firebase/firestore");

// toggle button

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const ProfileUser = ( {route} ) => {
    const dispatch = useDispatch();

    const currentUserID = useSelector(state => state.currentUser.ID);

    const userDisplayingID = route.params.uid; // user to display
    const [userDisplaying, setUserDisplaying] = useState({});

    const friends = useSelector(state => state.currentUser.friends);

    const outgoingRequests = useSelector(state => state.currentUser.outgoingRequests);

    // for the switch
    const [upComingEvents, setUpComingEvents] = useState(true);
    const [eventsAttended, setEventsAttended] = useState(false);
    const [toggleSide, setToggleSide] = useState("flex-start");

    useEffect(() => {
        const fetchUserToDisplay = async () => {
            const user = await firebase.firestore().collection("users")
                .doc(userDisplayingID)
                .get();
            setUserDisplaying(user.data());
        };
        fetchUserToDisplay();
    }, [route.params.uid]);

    // Adds a friend
    const addFriend = (id) => {
        // add searched person to the current user's outgoingRequests list
        firebase
            .firestore()
            .collection("users")
            .doc(currentUserID)
            .collection("outgoingRequests")
            .doc(id)
            .set({});
        // add current user to the searched person's incomingRequests list
        firebase
            .firestore()
            .collection("users")
            .doc(id)
            .collection("incomingRequests")
            .doc(currentUserID)
            .set({});
        dispatch(fetchUserOutgoingRequests());
    };

    const flipToggle = () => {
        if (upComingEvents) {
            setToggleSide("flex-end");
        } else if (eventsAttended) {
            setToggleSide("flex-start");
        }
        setUpComingEvents(!upComingEvents);
        setEventsAttended(!eventsAttended);
    };

    if (userDisplaying === null) {
        return <Text>Loading...</Text>;
    }

    const ProfileFollowing = () => {
        return (
            <View style={{flex: 1, justifyContent: "center"}}>
                {/* Friends Button */}
                <TouchableOpacity style={styles.alreadyFriend}>
                    <Text style={styles.alreadyFriendText}>Friends</Text>
                </TouchableOpacity>

                {/* Toggle Button */}
                <TouchableOpacity
                    style={[styles.toggleContainer, { justifyContent: toggleSide }]}
                    onPress={flipToggle}
                    activeOpacity="0.77"
                >
                    {/* upcoming events pressed */}
                    {upComingEvents && (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={styles.upcomingEventsContainer}>
                                <Text style={styles.toggleText}>Upcoming Events</Text>
                            </View>
                            <View style={styles.eventsAddedGreyTextContainer}>
                                <Text style={styles.eventsAddedGreyText}>Events Attended</Text>
                            </View>
                        </View>
                    )}

                    {/* events attended pressed */}
                    {eventsAttended && (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={styles.upcomingEventsGreyTextContainer}>
                                <Text style={styles.upcomingEventsGreyText}>
                                    Upcoming Events
                                </Text>
                            </View>
                            <View style={styles.eventsAddedContainer}>
                                <Text style={styles.toggleText}>Events Attended</Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                {/* List of events */}
                <View style={styles.containerGallery}>
                    {/*<FlatList*/}
                    {/*    data={currentUserEvents}*/}
                    {/*    renderItem={(event) => (*/}
                    {/*        // when the card is pressed, we head to EventDetails page*/}
                    {/*        <TouchableOpacity*/}
                    {/*            onPress={() =>*/}
                    {/*                navigation.navigate("EventDetails", {*/}
                    {/*                    event: event,*/}
                    {/*                })*/}
                    {/*            }*/}
                    {/*        >*/}
                    {/*            <Card event={event.item} />*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    )}*/}
                    {/*    showsVerticalScrollIndicator={false}*/}
                    {/*/>*/}
                    <Text>List of events</Text>
                </View>
            </View>
        );
    };

    const ProfileNotFollowing = (props) => {
        return (
            <View>
                {
                    props.requested
                    ?   <View>
                            <Text>Requested</Text>
                        </View>
                    :   <TouchableOpacity onPress={() => {addFriend(userDisplayingID)}} style={styles.addFriend}>
                            <Text style={styles.addFriendText}>Add Friend</Text>
                        </TouchableOpacity>
                }

                <View style={styles.lockContainer}>
                    <Image
                        source={require("../../assets/lock_outline.png")}
                        style={styles.lockIcon}
                    />
                    <Text style={styles.lockIconText}>
                        Follow this account to see their events
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.userNameContainer}>
                <Text style={styles.userNameText}>{userDisplaying.name}</Text>
            </View>

            {/* Profile Picture */}
            <View style={styles.profileBackground}>
                <Image
                    source={require("../../assets/profileicon.jpg")}
                    style={styles.profilePic}
                />
            </View>

            <View style={styles.infoView}>
                {/* User Info */}
                <View style={styles.containerInfo}>
                    <Text style={styles.userEmail}>{userDisplaying.email}</Text>
                </View>
                {
                    friends.indexOf(userDisplayingID) > -1 &&
                        <ProfileFollowing/>
                }
                {
                    outgoingRequests.indexOf(userDisplayingID) > -1 &&
                        <ProfileNotFollowing requested={true}/>
                }
                {
                    friends.indexOf(userDisplayingID) === -1 && outgoingRequests.indexOf(userDisplayingID) === -1 &&
                        <ProfileNotFollowing requested={false}/>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerInfo: {
        margin: 20,
    },
    containerGallery: {
        flex: 1,
    },
    containerImage: {
        flex: 1 / 3,
    },
    image: {
        flex: 1,
        aspectRatio: 1,
    },
    screenContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
    },

    // view
    infoView: {
        flex: Platform.OS === "ios" ? 5 : 6,
        backgroundColor: "white",
    },

    // user's name
    userNameContainer: {
        flex: 2,
        backgroundColor: "#5DB075",
        justifyContent: "center",
    },
    userNameText: {
        textAlign: "center",
        fontWeight: "500",
        fontSize: windowWidth * 0.084,
        color: "white",
        marginBottom: Platform.OS === "ios" ? 0 : 30,
    },

    // profile pic
    profileBackground: {
        width: 110,
        height: 110,
        borderRadius: 200,
        justifyContent: "center",
        marginLeft: 15,
        marginTop: -55,
        backgroundColor: "white",
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 400 / 2,
        marginLeft: 5,
        marginBottom: 0,
    },

    // user info
    userEmail: {
        marginLeft: 20,
        fontSize: windowWidth * 0.045,
        fontWeight: "400",
    },

    // add friend
    alreadyFriend: {
        flex: 1 / 10,
        marginHorizontal: windowWidth * 0.028,
        marginTop: 8,
        height: "7%",
        backgroundColor: "lightgrey",
        borderRadius: 10,
        justifyContent: "center",
    },
    alreadyFriendText: {
        textAlign: "center",
        color: "#666666",
        fontSize: windowWidth * 0.045,
    },

    /* toggle button */
    toggleContainer: {
        flex: 1 / 8,
        flexDirection: "row",
        marginHorizontal: windowWidth * 0.028,
        marginTop: 22,
        height: "7%",
        backgroundColor: "#ededed",
        borderRadius: 30,
        borderWidth: 0.3,
        borderColor: "grey",
    },

    // when upcoming button is clicked
    upcomingEventsContainer: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 30,
        height: "97%",
        justifyContent: "center",
        // flexDirection: "row",
    },
    eventsAddedGreyTextContainer: {
        flex: 1,
        height: "97%",
        justifyContent: "center",
    },
    eventsAddedGreyText: {
        color: "#BDBDBD",
        fontWeight: "500",
        fontSize: windowWidth * 0.043,
        textAlign: "center",
    },

    // when events added button is clicked
    eventsAddedContainer: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 30,
        height: "97%",
        justifyContent: "center",
    },
    upcomingEventsGreyTextContainer: {
        flex: 1,
        height: "97%",
        justifyContent: "center",
    },
    upcomingEventsGreyText: {
        color: "#BDBDBD",
        fontWeight: "500",
        fontSize: windowWidth * 0.043,
        textAlign: "center",
    },

    toggleText: {
        textAlign: "center",
        fontWeight: "500",
        fontSize: windowWidth * 0.043,
        color: "#5DB075",
    },
});

export default ProfileUser;
