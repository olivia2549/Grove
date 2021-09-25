import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import { fetchUserIncomingRequests } from "../../redux/actions";
import {setCurrentScreen, setDebugModeEnabled} from "expo-firebase-analytics";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Notifications = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  setDebugModeEnabled(true);
  setCurrentScreen("Notifications");

  const incomingRequests = useSelector(
    (state) => state.currentUser.incomingRequests
  );

  const [requestsToDisplay, setRequestsToDisplay] = useState([]);
  const currentUserID = useSelector((state) => state.currentUser.ID);

  useEffect(() => {
    dispatch(fetchUserIncomingRequests());
  }, []);

  // Fetch the new notifications from the incomingRequests state when incomingRequests changes
  useEffect(() => {
    const fetchRequests = async () => {
      const docs = await firebase
        .firestore()
        .collection("users")
        .orderBy("name")
        .get();

      let requestsArr = [];
      docs.forEach((doc) => {
        const id = doc.id;
        if (incomingRequests.indexOf(id) > -1) requestsArr.push(doc.data());
      });
      setRequestsToDisplay(requestsArr);
    };
    fetchRequests();
  }, [incomingRequests]);

  // Adds a friend
  const acceptRequest = (id) => {
    // add incoming request to the current user's friends list
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserID)
      .collection("friends")
      .doc(id)
      .set({});
    // remove current user from the incoming request's outgoingRequests list
    firebase
      .firestore()
      .collection("users")
      .doc(id)
      .collection("outgoingRequests")
      .doc(currentUserID)
      .delete();
    // remove incoming request from the current user's incomingRequests list
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserID)
      .collection("incomingRequests")
      .doc(id)
      .delete();
    // add current user to the incoming request's friend list
    firebase
      .firestore()
      .collection("users")
      .doc(id)
      .collection("friends")
      .doc(currentUserID)
      .set({});
    dispatch(fetchUserIncomingRequests());
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", top: 7 }}>
          Friend Requests
        </Text>
      </View>

      <View>
        {requestsToDisplay.length === 0 ? (
          <View style={styles.treeContainer}>
            <Image source={require("../../assets/grovetree.gif")} style={styles.treeDimension}/>
            <Text style={styles.treeWord}>Go Find Events to Make Friends!</Text>
          </View>
        ) : (
          <FlatList
            numColumns={1}
            horizontal={false}
            data={requestsToDisplay}
            keyExtractor={(item, index) => item.ID}
            style={{ marginTop: windowHeight * 0.03 }}
            renderItem={(
              { item } // Allows you to render a text item for each user
            ) => (
              <View style={styles.userCellContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ProfileUser", { uid: item.ID });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Image
                      source={require("../../assets/profileicon.jpg")}
                      style={styles.profilePic}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.userName}>{item.name}</Text>
                    </View>
                  </View>

                  {/* <View style={{ flexDirection: "row" }}> */}
                  <TouchableOpacity
                    style={styles.acceptRequestContainer}
                    onPress={() => {
                      acceptRequest(item.ID);
                    }}
                  >
                    <Text style={styles.acceptRequestContainerText}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.underline} />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flex: 1,
    backgroundColor: "white",
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
    fontSize: windowWidth * 0.04,
  },
  acceptRequestContainer: {
    justifyContent: "center",
    padding: 11,
    height: 40,
    backgroundColor: "#5DB075",
    borderRadius: 10,
    position: "absolute",
    right: 10,
  },
  acceptRequestContainerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  userCellContainer: {
    margin: 5,
    flex: 1,
  },
  underline: {
    borderBottomWidth: 1,
    width: "92.5%",
    borderBottomColor: "#E8E8E8",
    marginTop: 5,
    alignItems: "center",
    marginLeft: windowWidth * 0.028,
  },

  // tree and message
  treeContainer: {
    top: windowHeight * 0.26,
    left: windowWidth * 0.35,
  },
  treeDimension: {
    width: 100,
    height: 150,
  },
  treeWord: { marginTop: 13, left: -60, fontSize: 17 },
});

export default Notifications;
