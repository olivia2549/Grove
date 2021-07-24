import firebase from "firebase";

// fetch function return the doc object
export const fetchFromFirebase = async (id, collectionName) => {
    const doc = await firebase
        .firestore()
        .collection(collectionName)
        .doc(id)
        .get();
    return doc;
}


// date manipulation function
export const getWeekDay = (dateObject) => {
	const dayNumber = dateObject.getDay();
	if (
		dateObject.getDate() === new Date().getDate() &&
		dateObject.getMonth() === new Date().getMonth &&
		dateObject.getFullYear() === new Date().getFullYear()
	) {
		return "Today";
	}

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
			return "Friday";
		case 6:
			return "Sunday";
	}
};

export const getMonthName = (dateObject) => {
	const monthNumber = dateObject.getMonth();
	switch (monthNumber) {
		case 0:
			return "January";
		case 1:
			return "February";
		case 2:
			return "March";
		case 3:
			return "April";
		case 4:
			return "May";
		case 5:
			return "June";
		case 6:
			return "July";
		case 7:
			return "August";
		case 8:
			return "September";
		case 9:
			return "October";
		case 10:
			return "November";
		case 11:
			return "December";
	}
};

export const parseDate = (dateObject) => {
	return {
		date: dateObject.getDate(),
		month: getMonthName(dateObject),
		year: dateObject.getFullYear(),
		day: getWeekDay(dateObject),
		hour: dateObject.getHours(),
		minute: dateObject.getMinutes(),
		seconds: dateObject.getSeconds(),
		ampmTime: dateObject.toLocaleString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		}),
	};
};