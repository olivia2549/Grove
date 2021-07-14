import React, {useRef, useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, KeyboardAvoidingView,} from "react-native";
import styled from "styled-components";

// export const Container = (props) => (
//   <View style={{...styles.screenContainer, ...props.style}}>
//     {props.children}
//   </View>
// );

export const FancyButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.fancyButtonContainer}>
    <Text style={styles.fancyButtonText}>{title}</Text>
  </TouchableOpacity>
);

export const FancyButtonButLower = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.fancyButtonButLowerContainer}>
    <Text style={styles.fancyButtonText}>{title}</Text>
  </TouchableOpacity>
);

export const FancyInput = ({ placeholder, onChangeText, secureTextEntry }) => (
  <View style={styles.inputView}>
    <TextInput
    style={styles.TextInput}
    placeholder={placeholder}
    placeholderTextColor="#003f5c"
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
  />
  </View>
  
)


const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16
  },
  fancyButtonContainer: {
    elevation: 8,
    backgroundColor: "#5DB075",
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  fancyButtonButLowerContainer: {
    elevation: 8,
    backgroundColor: "#5DB075",
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 40
  },
  fancyButtonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
  },
  image: {
      marginBottom: 40,
      height: 400,
  },
  inputView: {
    backgroundColor: "#F6F6F6",
    height: 45,
    marginBottom: 20,
    alignItems: 'flex-start',
    borderRadius: 8,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    width: "95%",
  },
});
