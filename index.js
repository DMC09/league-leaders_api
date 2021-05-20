// Imports
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const app = express();

// Variable declartions
const regularSznAPI = `https://api.sportradar.us/nba/trial/v7/en/seasons/2020/REG/leaders.json?api_key=${process.env.API_KEY}`;
const playoffsAPI = `https://api.sportradar.us/nba/trial/v7/en/seasons/2020/PST/leaders.json?api_key=${process.env.API_KEY}`;
const headshotAPI = `http://data.nba.net/data/10s/prod/v1/2020/players.json`;
let port = process.env.PORT || 8080;
let regularSznData;
let playoffsData;
let headshots;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//setup
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});
// initialize the data
getRegularSznData();
getHeadshotData();
getPlayoffsData();
// cron scheduled every 6 hours to get new data or if data is null
cron.schedule("0 */6 * * *", function () {
  let date = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour12: true,
  });
  getRegularSznData();
  console.log("CronJob Task running at " + date);
  console.log(
    regularSznData,
    "this is the regularSznData read from the cron job"
  );
});

// function to get data
async function getRegularSznData() {
  try {
    const response = await axios.get(regularSznAPI);
    playoffsData = await response.data;
    console.log("Grabbing new API Stats");
    let date = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      hour12: true,
    });
    console.log("Regular season data refreshed at" + date);
  } catch (e) {
    console.log(e);
  }
}
async function getPlayoffsData() {
  try {
    const response = await axios.get(playoffsAPI);
    playoffsData = await response.data;
    console.log("Grabbing new API Stats");
    let date = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      hour12: true,
    });
    console.log("Playoffs Data refreshed at" + date);
  } catch (e) {
    console.log(e);
  }
}
async function getHeadshotData() {
  try {
    const response = await axios.get(headshotAPI);
    headshots = await response.data;
    console.log("Grabbing headshots");
    let date = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      hour12: true,
    });
    console.log("headshots retrieved at " + date);
  } catch (e) {
    console.log(e);
  }
}

// regular season route.
app.get("/regular", async (req, res) => {
  let date = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour12: true,
  });
  res.json({ data: regularSznData });
  console.log("the api Data is being request at " + date);
});
// Headshots route.
app.get("/headshot", async (req, res) => {
  let date = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour12: true,
  });
  res.json({ data: headshots });
  console.log("headshot data requested at  " + date);
});
// Playoffs  route.
app.get("/playoffs", async (req, res) => {
  let date = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour12: true,
  });
  res.json({ data: playoffsData });
  console.log("playoff data  requested at  " + date);
});

app.listen(port, () => {
  console.log(`example app is listenining port ${port}`);
});
