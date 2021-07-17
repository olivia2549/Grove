import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addEventDescription, addEventTags } from "../../redux/actions";

const AddEventDescription = ( ) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [eventDescription, setEventDescription] = useState("");

    const allTags = [
        "Sports",
        "Social",
        "Orgs",
        "Free food",
        "Invite-only",
        "All-welcome",
        "Party",
    ];

    const selectedTags = [];

    const Tag = (props) => {
        const grey = "#f6f7fa";
        const green = "#5db075";
        let [color, setColor] = useState(grey);

        const onPress = () => {
            const tagName = props.title;
            color === grey ? setColor(green) : setColor(grey);
            // push tagName to selectedTags if not already there, pop if already there
            if (selectedTags.indexOf(tagName) === -1) {
                selectedTags.push(tagName);
            }
            else {
                selectedTags.splice(selectedTags.indexOf(tagName), 1);
            }
        };

        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    backgroundColor: color,
                    borderRadius: 5,
                    padding: 5,
                    margin: 5,
                    width: 70,
                }}
                activeOpacity={0.6}
            >
                <Text>{props.title}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text>Description and Tags</Text>
            <TextInput
                id="eventDescription"
                name="eventDescription"
                onChangeText={(text) => {setEventDescription(text)}}
                placeholder="Description..."
                value={eventDescription}
            />
            <View>
                {allTags.map((tag, i) => {
                    return <Tag key={i} title={tag} />;
                })}
            </View>

            <Button
                title="Next"
                onPress={() => {
                    dispatch(addEventDescription(eventDescription));
                    dispatch(addEventTags(selectedTags));
                    navigation.navigate("AddEventDate");
                }}
            />
        </View>
    );
};

export default AddEventDescription;
