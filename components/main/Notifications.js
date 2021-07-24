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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import { fetchUserIncomingRequests } from "../../redux/actions";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const Notifications = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Title */}
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>Notifications</Text>
      </View>

      <View>
        <Text style={styles.friendRequestTitle}>Friend Requests</Text>
      </View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={requestsToDisplay}
        renderItem={(
          { item } // Allows you to render a text item for each user
        ) => (
          <View style={styles.userCellContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ProfileUser", { uid: item.ID });
              }}
              style={styles.profileComponentWithoutBorderline}
            >
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Image
                  source={require("../../assets/profileicon.jpg")}
                  style={styles.profilePic}
                />
                <Text style={styles.userName}>{item.name}</Text>
              </View>

              {/* <View style={{ flexDirection: "row" }}> */}
              <TouchableOpacity
                style={styles.acceptRequestContainer}
                onPress={() => {
                  acceptRequest(item.ID);
                }}
              >
                <Text style={styles.acceptRequestContainerText}>Accept</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                  style={styles.acceptRequestContainer}
                  onPress={() => console.log("I deny this person")}
                >
                  <Text style={styles.acceptRequestContainerText}>Deny</Text>
                </TouchableOpacity>
              </View> */}

              {/* <Button
                title="accept request"
                onPress={() => {
                  acceptRequest(item.ID);
                }}
              /> */}
            </TouchableOpacity>

            <View style={styles.underline} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 400 / 2,
  },
  userName: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 5,
  },

  titleBox: {
    height: "18%",
    backgroundColor: "white",
    justifyContent: "center",
    width: "100%",
  },
  titleText: {
    textAlign: "center",
    fontSize: windowWidth * 0.088,
    color: "black",
    fontWeight: "700",
    marginTop: windowHeight * 0.05,
  },

  friendRequestTitle: {
    textAlign: "center",
    fontSize: 24,
    color: "black",
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },

  // for each profile components
  profileComponentWithoutBorderline: {
    flexDirection: "row",
    marginTop: 5,
    flex: 1,
    paddingHorizontal: 13,
  },
  addFriendButton: {
    justifyContent: "center",
    padding: 11,
    height: 33,
    backgroundColor: "#5DB075",
    borderRadius: 10,
    position: "absolute",
    right: 10,
  },
  addFriendText: {
    textAlign: "center",
    color: "white",
  },
  acceptRequestContainer: {
    justifyContent: "center",
    padding: 11,
    height: 33,
    backgroundColor: "#5DB075",
    borderRadius: 10,
    position: "absolute",
    right: 10,
  },
  acceptRequestContainerText: {
    textAlign: "center",
    color: "white",
  },
  userCellContainer: {
    margin: 5,
    flex: 1,
    // paddingHorizontal: 10,
  },
  // profilePic: {
  //   width: 45,
  //   height: 45,
  //   borderRadius: 400 / 2,
  // },
  // userName: {
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   marginLeft: 10,
  //   // marginTop: 10,
  //   fontWeight: "bold",
  //   // fontSize: windowWidth * 0.042,
  //   fontSize: 20,
  // },

  underline: {
    borderBottomWidth: 1,
    width: "92.5%",
    borderBottomColor: "#E8E8E8",
    marginTop: 5,
    alignItems: "center",
    marginLeft: windowWidth * 0.028,
  },
});

export default Notifications;
