// API DATA

const GEONAMES_BASE_URL = "http://api.geonames.org/searchJSON?q=";
const GEONAMES_USERNAME = "hulya";

const WEATHERBIT_BASE_URL = "https://api.weatherbit.io/v2.0/forecast/daily?lat=";
const WEATHERBIT_API_KEY = "&key=04fa6da2d39e4f31b3d25b6d75ad1c84";

const PIXABAY_BASE_URL = "https://pixabay.com/api/?key=";
const PIXABAY_API_KEY = "16060501-e2d3132e99ce2be48e2344f5f";

// MAIN OBJECT TO STORE DATA

const TRIPS_DATA = {};

// SERVER SETUP

/* Express to run server and routes */
const express = require("express");
const request = require("request");

/* Start up an instance of app */
const app = express();

const fetch = require("node-fetch");

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// EXTERNAL API CALLS

const fetchCityCoordinates = async (cityName = "") => {
    const queryUrl =
        GEONAMES_BASE_URL + cityName + "&maxRows=1&username=" + GEONAMES_USERNAME;

    const request = await fetch(queryUrl);
    try {
        // Transform into JSON
        const data = await request.json();

        const coordinates = {
            longitude: data.geonames[0].lng,
            latitude: data.geonames[0].lat
        };
        return coordinates;
    } catch (error) {
        console.log("error", error);
    }
};
// https://api.weatherbit.io/
const fetchWeatherData = async (latitude = "", longitude = "", time = "") => {
    const queryUrl =
        WEATHERBIT_BASE_URL +
        latitude +
        "&" +
        "lon=" +
        longitude +

        WEATHERBIT_API_KEY;

    const request = await fetch(queryUrl);

    try {
        const data = await request.json();
        console.log(data)
        const forecast = {
            summary: data.data[0].weather.description,
            tempLow: data.data[0].low_temp,
            tempHigh: data.data[0].max_temp

        };

        return forecast;
    } catch (error) {
        console.log("error", error);
    }
};

const fetchCityImage = async (cityName = "") => {
    const queryUrl =
        PIXABAY_BASE_URL +
        PIXABAY_API_KEY +
        "&image_type=photo&per_page=3&q=" +
        cityName;

    const request = await fetch(queryUrl);
    try {
        // Transform into JSON
        const data = await request.json();
        const imageInfo = {
            imageUrl: data.hits[0].webformatURL,
            width: data.hits[0].webformatWidth,
            height: data.hits[0].webformatHeight
        };
        return imageInfo;
    } catch (error) {
        console.log("error", error);
    }
};

// API ROUTES

// GET route

// home page
app.get("/", (req, res) => res.sendFile(__dirname + '/index.html'));

// all trips
app.get("/trips", (request, response) => {
    response.json(TRIPS_DATA);
});

// POST route
app.post("/fetchInfo", (req, res) => {
    const city = req.body.tripData.city;
    const startDate = req.body.tripData.start_date;
    const endDate = req.body.tripData.end_date;
    const dateInUnix = req.body.tripData.date;

    const trip_info = {
        city,
        startDate,
        endDate,
        dateInUnix
    };

    fetchCityCoordinates(city).then(coordinates => {
        trip_info["latitude"] = coordinates.latitude;
        trip_info["longitude"] = coordinates.longitude;

        fetchWeatherData(
            coordinates.latitude,
            coordinates.longitude,
            dateInUnix
        ).then(forecast => {
            trip_info["weatherSummary"] = forecast.summary;
            trip_info["lowTemp"] = forecast.tempLow;
            trip_info["highTemp"] = forecast.tempHigh;

            fetchCityImage(city).then(imageInfo => {
                trip_info["cityImageUrl"] = imageInfo.imageUrl;
                res.send(trip_info);
                res.json(trip_info);
            });
        });
    });
});

app.post("/fetchWeather", (req, res) => {
    const queryUrl = req.body.queryUrl;

    request({
        url: queryUrl
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            return res.status(500).json({
                type: "error",
                message: err.message
            });
        }

        res.json(JSON.parse(body));
    });
});

// START SERVER

const port = 3030;
/* Spin up the server*/
const server = app.listen(process.env.PORT || port, () => {
    console.log(`running on localhost: ${port}`);
});


module.exports = server;