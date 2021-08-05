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
			return "Sun";
		case 1:
			return "Mon";
		case 2:
			return "Tues";
		case 3:
			return "Wed";
		case 4:
			return "Thurs";
		case 5:
			return "Fri";
		case 6:
			return "Sun";
	}
};

export const getMonthName = (dateObject) => {
	const monthNumber = dateObject.getMonth();
	switch (monthNumber) {
		case 0:
			return "Jan";
		case 1:
			return "Feb";
		case 2:
			return "Mar";
		case 3:
			return "Apr";
		case 4:
			return "May";
		case 5:
			return "Jun";
		case 6:
			return "Jul";
		case 7:
			return "Aug";
		case 8:
			return "Sept";
		case 9:
			return "Oct";
		case 10:
			return "Nov";
		case 11:
			return "Dec";
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