import React, {useState} from 'react';
import {View, Button, Text, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddEventDate = ({ route }) => {
    const [mode, setMode] = useState('date');

    const [post, setPost] = useState({
        name: route.params.name,
        description: "",
        tags: [],
        location: "",
        startdate: new Date(),
        enddate: new Date(),
    });

    const onChange = (ev, selectedDate) => {
        const currentDate = selectedDate || date;
        ev.target.id == "start" ? 
            setPost({startdate: currentDate}) : 
            setPost({enddate: currentDate})
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
                    value={post.startdate}
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
                    value={post.startdate}
                />
                <DateTimePicker
                    mode="time"
                    display="default"
                    is24Hour={true}
                    onChange={onChange}
                    value={post.startdate}
                />
            </View>
        );
    };


    return (
        <View style={{marginTop: 50}}>
            <Text>Time and Location</Text>
            {Platform.OS == 'ios' ? 
                <View>
                    <IosDateTimePicker title="Starts" value={post.startdate}/>
                    <IosDateTimePicker title="Starts" value={post.startdate}/>
                </View>
            : 
            <AndroidDateTimePicker title="Ends" value={post.enddate}/>}
        </View>
    );
};

export default AddEventDate;