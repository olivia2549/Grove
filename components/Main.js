import React, {Component, useEffect} from "react";
import { Text, View } from "react-native"

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions/index";

// 'navigation' gives us access to the route from App.js
export const Main = (navigation) => {
    useEffect(() => {
        fetchUser()
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Text>User is logged in</Text>
        </View>
    );
}

// binds our main component to redux and allows us to fetchUser
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(null, mapDispatchProps)(Main);
