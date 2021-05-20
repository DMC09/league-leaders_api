// Imports
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require("body-parser");
const cron = require('node-cron');
const app = express();

// Variable declartion
const statAPI = `https://api.sportradar.us/nba/trial/v7/en/seasons/2020/REG/leaders.json?api_key=${process.env.API_KEY}`
const headshotAPI = `http://data.nba.net/data/10s/prod/v1/2020/players.json`
let port = process.env.PORT || 8080;
let info;
let headshots;

// middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

//setup
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
// initialize the data
getApiData();
getHeadshotData();
// cron scheduleed every 6 hours to get new data or if data is null
cron.schedule('0 */6 * * *', function() {
  let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
  getApiData();
  console.log('CronJob Task running at ' + date);
  console.log(info,'this is the info read from the cron job');
});



// function to get data
async function getApiData() {
  try{
    const response = await axios.get(statAPI);
    info = await response.data;
    console.log('Grabbing new API Stats');
    let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
    console.log('Api Date refreshed at' + date);
  } catch(e){
    console.log(e);
  }
}
async function getHeadshotData() {
  try{
    const response = await axios.get(headshotAPI);
    headshots = await response.data;
    console.log('Grabbing headshots');
    let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
    console.log('headshots retrieved at ' + date);
  } catch(e){
    console.log(e);
  }
}



app.get('/',async (req,res)=>{

  let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
res.json({ data: info });
console.log('the api Data is being request at ' + date);
});

app.get('/headshot',async (req,res)=>{

  let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
res.json({ data: headshots });
console.log('headshot data requested at  ' + date);
});
app.get('/playoffs',async (req,res)=>{

  let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
res.json({ data: headshots });
console.log('playoff data  requested at  ' + date);
});


app.listen(port, () => {
  console.log(`example app is listenining port ${port}`);
});
