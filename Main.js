// Master component

import React, { useEffect } from "react";
import { Text, View } from "react-native"

import { fetchUser } from "./redux/actions";
import { useSelector, useDispatch } from "react-redux";

export const Main = () => {
    const user = useSelector((state) => state.currentUser);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUser());
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Text>{user} is logged in</Text>
        </View>
    );
}

export default Main;
