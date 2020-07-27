function calculateTime(startDate, endDate) {
    const today = getTodaysDate();
    if (
        dateToUnixTimestamp(startDate) < dateToUnixTimestamp(today) ||
        dateToUnixTimestamp(endDate) <= dateToUnixTimestamp(today) ||
        dateToUnixTimestamp(endDate) <= dateToUnixTimestamp(startDate)
    ) {
        return "error";
    } else {
        return calculateDifference(startDate, endDate);
    }
}

const getTodaysDate = () => {
    const today = new Date();
    const date =
        today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    return date;
};

const dateToUnixTimestamp = date => {
    return new Date(date).getTime() / 1000;
};

const calculateDifference = (startDate, endDate) => {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);

    const Difference_In_Time = date2.getTime() - date1.getTime();

    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
};

module.exports = {
    calculateTime
};