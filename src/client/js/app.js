const {
  calculateTime
} = require("./calculateTime");
const {
  createTripCard
} = require("./createTripCard");

// UI elements
const destination = document.getElementById("travel-destination");
const startDate = document.getElementById("travel-start-date");
const endDate = document.getElementById("travel-end-date");
const saveBtn = document.getElementById("save-trip-btn");
const errorText = document.getElementById("error-text");

const myTripsContainer = document.getElementById("my-trips");

const sendRequestToServer = async (
  city = "",
  start_date = "",
  end_date = "",
  date = ""
) => {
  const tripData = {
    city,
    start_date,
    end_date,
    date
  };
  const response = await fetch("http://localhost:3030/fetchInfo", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tripData
    })
  });

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const formSubmitHandler = () => {
  const city = destination.value;
  const start_date = startDate.value;
  const end_date = endDate.value;
  const dateInUnix = new Date(start_date).getTime() / 1000;

  const diff = calculateTime(start_date, end_date);
  if (diff === "error") {
    errorText.setAttribute("display", "block");
    errorText.textContent = "Check the dates";
    return;
  }

  saveBtn.textContent = "Wait a second...";

  errorText.textContent = "";
  errorText.setAttribute("display", "none");

  sendRequestToServer(city, start_date, end_date, dateInUnix).then(data => {
    const tripContainer = createTripCard(
      data.city,
      data.startDate,
      data.endDate,
      diff,
      data.weatherSummary,
      data.lowTemp,
      data.highTemp,
      data.cityImageUrl
    );

    myTripsContainer.appendChild(tripContainer);
    saveBtn.textContent = "Save trip";
  });
};

module.exports = {
  formSubmitHandler
};