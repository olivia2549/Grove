import React, {useState} from 'react';
import {View, Button, Text, Platform, TextInput} from 'react-native';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addEndEventTime, addEventLocation, addStartEventTime } from '../../redux/actions';
import { useNavigation } from "@react-navigation/native";

const AddEventDate = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [mode, setMode] = useState('date');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [location, setLocation] = useState("");

    const onChange = (ev, selectedDate) => {
        const currentDate = selectedDate || date;
        ev.target.id == "start" ? 
            setStartDate(currentDate) : 
            setEndDate(currentDate);
    };

    const IosDateTimePicker = (props) => {
        return (
            <View>
                <Text>{props.title}</Text>
                <DateTimePicker
                    mode="datetime"
                    display="default"
                    is24Hour={true}
                    onChange={props.onChange}
                    value={startDate}
                />
            </View>
        );
    };

    const AndroidDateTimePicker = (props) => {
        return (
            <View>
                <Text>{props.title}</Text>
                <DateTimePicker
                    mode="date"
                    display="default"
                    is24Hour={true}
                    onChange={onChange}
                    value={startDate}
                />
                <DateTimePicker
                    mode="time"
                    display="default"
                    is24Hour={true}
                    onChange={onChange}
                    value={startDate}
                />
            </View>
        );
    };


    return (
        <View style={{marginTop: 50}}>
            <Text>Time and Location</Text>
            {Platform.OS == 'ios' ? 
                <View>
                    <IosDateTimePicker title="Starts" value={startDate}/>
                    <IosDateTimePicker title="Ends" value={startDate}/>
                </View>
            : 
                <View>
                    <AndroidDateTimePicker title="Starts" value={endDate}/>
                    <AndroidDateTimePicker title="Ends" value={endDate}/>
                </View>}
            <TextInput
                placeholder="Event Location..."
                onChangeText={(text) => { setLocation(text); }}
            ></TextInput>
            <Button
                title="Next"
                onPress={() => {
                    dispatch(addStartEventTime(startDate));
                    dispatch(addEndEventTime(endDate));
                    dispatch(addEventLocation(location));
                    navigation.navigate("AddEventConfirmation");
                }}
            />
        </View>

    );
};

export default AddEventDate;