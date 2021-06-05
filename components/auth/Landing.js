import React from 'react';
import { Text, View, Button } from 'react-native'

// 'navigation' gives us access to the route from App.js
function Landing({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Button title="Register" onPress={() => navigation.navigate("Register")}/>
            <Button title="Login" onPress={() => navigation.navigate("Login")}/>
        </View>
    );
}
//This comment was made by Grove gang
export default Landing;
