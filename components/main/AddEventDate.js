/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * AddEventDate.js
 * User adds new event date
 */

import React from 'react';
import {View, Button, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { addEndDateTime, addEventLocation, addStartDateTime } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { useNavigation } from "@react-navigation/native";

const AddEventDate = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const defaultDate = new Date();

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
        }
        else {
            dispatch(addEndDateTime(currentDate, dateOrTime));
        }
    };

    const DateTimePickerWithText = (props) => {
        return (
            <View>
                <Text>{props.title}</Text>
                <View style={{flexDirection: "row", alignItems: "flex-start", width: "70%"}}>
                    <View style={{flex: 1}}>
                        <DateTimePicker
                            mode="date"
                            display="default"
                            is24Hour={true}
                            onChange={(ev, selectedDate) => {
                                onChange(ev, selectedDate, props.title, "date")
                            }}
                            value={defaultDate}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <DateTimePicker
                            mode="time"
                            display="default"
                            is24Hour={true}
                            onChange={(ev, selectedDate) => {
                                onChange(ev, selectedDate, props.title, "time")
                            }}
                            value={defaultDate}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={{marginTop: 50}}>
            <Text>Add Time</Text>
            <View>
                <DateTimePickerWithText title="Starts"/>
                <DateTimePickerWithText title="Ends"/>
            </View>
            <Button
                title="Next"
                onPress={() => {
                    navigation.navigate("AddEventConfirmation");
                }}
            />
        </View>
    );
};

export default AddEventDate;
