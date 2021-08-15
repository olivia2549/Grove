/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventTags.js
 * User adds new event tags
 */

import React, { useState } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addEventTags } from "../../redux/actions";

import { FancyButtonButLower } from "../styling";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const AddEventTags = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const allTags = [
    "Activism",
    "Cultural",
    "Free food",
    "Orgs",
    "Party",
    "Performances",
    "Professional",
    "Service",
    "Social",
    "Speakers",
    "Sports",
  ];

  const selectedTags = [];

  const Tag = (props) => {
    const grey = "lightgray";
    const green = "#5db075";
    let [color, setColor] = useState(grey);
    let [textColor, setTextColor] = useState("black");

    const onPress = () => {
      const tagName = props.title;
      color === grey ? setColor(green) : setColor(grey);
      textColor === "black" ? setTextColor("white") : setTextColor("black");
      // push tagName to selectedTags if not already there, pop if already there
      if (selectedTags.indexOf(tagName) === -1) {
        selectedTags.push(tagName);
      } else {
        selectedTags.splice(selectedTags.indexOf(tagName), 1);
      }
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.eachTag, { backgroundColor: color }]}
        activeOpacity={0.6}
      >
        <Text style={[styles.tagText, {color: textColor}]}>{props.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons style={{top: "50%"}} name="chevron-down" color={"white"} size={35}/>
        </TouchableOpacity>
        <Text style={styles.titleText}>Communities</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.tagsFormat}>
          {allTags.map((tag, i) => {
            return <Tag key={i} title={tag} />;
          })}
        </View>
      </View>

      <View style={{ width: windowWidth, bottom: windowWidth * 0.1 }}>
        <FancyButtonButLower
          title="Next"
          onPress={() => {
            dispatch(addEventTags(selectedTags));
            navigation.navigate("AddEventDate");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 7,
    justifyContent: "center",
    marginTop: windowHeight * 0.15,
  },
  keyBoardAvoid: {
    marginTop: windowHeight * 0.25,
  },
  textInput: {
    fontSize: windowWidth * 0.08,
    marginLeft: windowWidth * 0.05,
    marginBottom: 20,
    marginTop: windowHeight * 0.012,
  },
  topBar: {
    backgroundColor: "#5DB075",
    height: "20%",
    width: "100%",
    position: "absolute",
    top: 0,
    justifyContent: "center",
    flex: 1,
  },
  titleText: {
    color: "#ffffff",
    fontWeight: "600",
    top: "15%",
    padding: 25,
    fontSize: windowWidth * 0.12,
  },
  eachTag: {
    borderRadius: 20,
    padding: windowWidth * 0.04,
    margin: 5,
    width: windowWidth * 0.4,
    justifyContent: "center",
  },
  tagText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: windowWidth * 0.05,
  },
  tagsFormat: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default AddEventTags;
