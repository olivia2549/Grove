// import React, {useState} from 'react';
// import {View, Button, Text, Platform, TextInput} from 'react-native';
// import { useDispatch } from 'react-redux';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { addEndEventTime, addEventLocation, addStartEventTime } from '../../redux/actions';
// import { useNavigation } from "@react-navigation/native";

// const AddEventDate = () => {
//     const dispatch = useDispatch();
//     const navigation = useNavigation();
//     const defaultDate = new Date();
//     const [startDate, setStartDate] = useState(new Date());
//     const [endDate, setEndDate] = useState(new Date());
//     const [location, setLocation] = useState("");

//     const onChange = (ev, selectedDate, id) => {
//         const currentDate = selectedDate || defaultDate;
//         id === "Starts" ?
//             setStartDate(currentDate) :
//             setEndDate(currentDate);
//     };

//     const DateTimePickerWithText = (props) => {
//         return (
//             <View>
//                 <Text>{props.title}</Text>
//                 <View style={{flexDirection: "row", alignItems: "flex-start", width: "70%"}}>
//                     <View style={{flex: 1}}>
//                         <DateTimePicker
//                             mode="date"
//                             display="default"
//                             is24Hour={true}
//                             onChange={(ev, selectedDate) => {
//                                 onChange(ev, selectedDate, props.title)
//                             }}
//                             value={props.value}
//                         />
//                     </View>
//                     <View style={{flex: 1}}>
//                         <DateTimePicker
//                             mode="time"
//                             display="default"
//                             is24Hour={true}
//                             onChange={(ev, selectedDate) => {
//                                 onChange(ev, selectedDate, props.title)
//                             }}
//                             value={props.value}
//                         />
//                     </View>
//                 </View>
//             </View>
//         );
//     };

//     return (
//         <View style={{marginTop: 50}}>
//             <Text>Time and Location</Text>
//             <View>
//                 <DateTimePickerWithText title="Starts" value={startDate}/>
//                 <DateTimePickerWithText title="Ends" value={endDate}/>
//             </View>
//             <TextInput
//                 placeholder="Event Location..."
//                 onChangeText={(text) => { setLocation(text); }}
//             />
//             <Button
//                 title="Next"
//                 onPress={() => {
//                     dispatch(addStartEventTime(startDate));
//                     dispatch(addEndEventTime(endDate));
//                     dispatch(addEventLocation(location));
//                     navigation.navigate("AddEventConfirmation");
//                 }}
//             />
//         </View>

//     );
// };

// export default AddEventDate;

import React, {useState} from 'react';
import {View, Button, Text, Platform, TextInput} from 'react-native';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addEndDateTime, addEventLocation, addStartDateTime } from '../../redux/actions';
import { useNavigation } from "@react-navigation/native";

const AddEventDate = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const defaultDate = new Date();
    const [location, setLocation] = useState("");
    let start = {
        time: defaultDate.getTime(),
        date: defaultDate.getDate(),
    }; 

    const onChange = (ev, selectedDate, id, dateOrTime) => {
        const currentDate = selectedDate || defaultDate;
        console.log(currentDate);
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
            <Text>Location and Time</Text>
            <TextInput
                placeholder="Event Location..."
                onChangeText={(text) => { setLocation(text); }}
            />
            <View>
                <DateTimePickerWithText title="Starts"/>
                <DateTimePickerWithText title="Ends"/>
            </View>
            <Button
                title="Next"
                onPress={() => {
                    dispatch(addEventLocation(location));
                    navigation.navigate("AddEventConfirmation");
                }}
            />
        </View>

    );
};

export default AddEventDate;
