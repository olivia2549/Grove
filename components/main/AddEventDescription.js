import { Button, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addEventDescription } from "../../redux/actions";

const AddEventDescription = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const eventName = useSelector((state) => state.event.eventName);
    const [eventDescription, setEventDescription] = useState("");

    useEffect(() => {
        console.log(eventName);
        dispatch(addEventDescription(eventDescription));
    })

    const onChange = (ev) => {
        setEventDescription(ev.target.value);
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Tags and Description</Text>

            <TextInput
                id="eventDescription"
                name="eventDescription"
                onChange={onChange}
                placeholder="Description..."
                value={eventDescription}
            />

            <Button title="Next"/>
        </View>
    );
};

export default AddEventDescription;
