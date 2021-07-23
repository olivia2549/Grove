/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventDate.js
 * User adds new event date
 */

import React, { useState } from "react";
import { View, Button, Text, Dimensions, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  addEndDateTime,
  addEventLocation,
  addStartDateTime,
} from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { FancyButtonButLower } from "../styling";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const AddEventDate = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [defaultDate, setDefaultDate] = useState(new Date());

  let start = {
    time: defaultDate.getTime(),
    date: defaultDate.getDate(),
  };

  const onChange = (ev, selectedDate, id, dateOrTime) => {
    const currentDate = selectedDate || defaultDate;
    if (id === "Starts") {
      if (dateOrTime === "date") {
        start.date = currentDate.getDate();
      } else {
        start.time = currentDate.getTime();
      }
      dispatch(addStartDateTime(currentDate, dateOrTime));
      dispatch(addEndDateTime(currentDate, dateOrTime));
      // setDefaultDate(currentDate)
    } else {
      dispatch(addEndDateTime(currentDate, dateOrTime));
    }
  };

  const DateTimePickerWithText = (props) => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            width: "70%",
          }}
        >
          <View style={{ flex: 1 }}>
            <DateTimePicker
              mode="date"
              display="default"
              minuteInterval={15}
              // is24Hour={true}
              onChange={(ev, selectedDate) => {
                onChange(ev, selectedDate, props.title, "date");
              }}
              value={defaultDate}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <DateTimePicker
              mode="time"
              display="default"
              minuteInterval={15}
              // is24Hour={true}
              onChange={(ev, selectedDate) => {
                onChange(ev, selectedDate, props.title, "time");
              }}
              value={defaultDate}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titleText}>Time</Text>
      </View>
      <View style={styles.content}>
        {/* Starts date time picker */}
        <View style={styles.textBox}>
          <Text style={styles.textBoxText}>Starts</Text>
        </View>
        <View style={styles.underline} />
        <View style={styles.datePickerContainer}>
          <DateTimePickerWithText title="Starts"/>
        </View>

        {/* Ends date time picker */}
        <View style={styles.textBox}>
          <Text style={styles.textBoxText}>Ends</Text>
        </View>
        <View style={styles.underline} />
        <View style={styles.datePickerContainer}>
          <DateTimePickerWithText title="Ends" />
        </View>
      </View>
      <View style={{ bottom: windowWidth * 0.1 }}>
        <FancyButtonButLower
          title="Next"
          onPress={() => {
            navigation.navigate("AddEventConfirmation");
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
    marginTop: windowHeight * 0.24,
    justifyContent: "flex-start",
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
    top: "20%",
    padding: 25,
    fontSize: windowWidth * 0.12,
  },

  textBox: {
    // "Starts" and "Ends" styling
    marginLeft: windowWidth * 0.05,
    borderRadius: 10,
    justifyContent: "flex-start",
    marginTop: 25,
  },
  textBoxText: {
    color: "#5DB075",
    marginLeft: windowWidth * 0.022,
    fontSize: windowWidth * 0.047,
  },
  underline: {
    borderBottomWidth: 1,
    width: windowWidth * 0.7,
    borderBottomColor: "#5DB075",
    marginLeft: windowWidth * 0.05,
  },

  datePickerContainer: { marginLeft: windowWidth * 0.05, marginTop: 10 },
});

export default AddEventDate;
