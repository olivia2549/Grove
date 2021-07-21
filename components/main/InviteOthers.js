import React, { useState, useRef } from "react";

import { Text, View, Share, SafeAreaView } from "react-native";
import { FancyButton, FancyInput } from "../styling";

export const InviteOthers = () => {
    const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              "*User* is inviting you to *event*. Check it out on Grove! *link*",
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };

      return (
          <SafeAreaView style={{flex: 1,}}>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                 <Text>Friends go here</Text>
              </View>
              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <FancyButton onPress={onShare} title='share'></FancyButton>
              </View>
          </SafeAreaView>

      );
}

export default InviteOthers;