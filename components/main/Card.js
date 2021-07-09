/**
 * Copyright Grove, @2021 - All rights reserved
 *
 * Card.js
 * Displays main feed
 */
// this is the card component for the posts in the feed

import React, {useState} from "react";
import { View, Text } from "react-native";

const getWeekDay = (dateObject) => {
    const dayNumber = dateObject.getDay();
    switch (dayNumber) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday"
        case 6:
            return "Sunday";
    }
}

const getMonthName = (dateObject) => {
    const monthNumber = dateObject.getMonth();
    switch (monthNumber) {
        case 0:
            return "January"
        case 1:
            return "February"
        case 2:
            return "March"
        case 3:
            return "April"
        case 4:
            return "May"
        case 5:
            return "June"
        case 6:
            return "July"
        case 7:
            return "August"
        case 8:
            return "September"
        case 9:
            return "October"
        case 10:
            return "November"
        case 11:
            return "December"
    }
}

const parseDate = (dateObject) => {
    return ({
        date: dateObject.getDate(),
        month: getMonthName(dateObject),
        year:dateObject.getFullYear(),
        day:getWeekDay(dateObject),
        hour: dateObject.getHours(),
        minute: dateObject.getMinutes(),
        seconds: dateObject.getSeconds(),
    })
}
