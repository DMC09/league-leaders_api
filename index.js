// Imports
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require("body-parser");
const cron = require('node-cron');
const app = express();

// Variable declartion
const endpoint = `https://api.sportradar.us/nba/trial/v7/en/seasons/2020/REG/leaders.json?api_key=${process.env.API_KEY}`
let port = process.env.PORT || 8080;
let info;

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

// cron scheduleed every 6 hours to get new data or if data is null
cron.schedule('0 */6 * * *', function() {
  let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
  getApiData();
  console.log('CronJob Task running at ' + date);
  console.log(info,'this is the info read from the cron job');
});
cron.schedule('* * * * *', function() {
  let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
  console.log(info,'this is the info read from the cron job that is run every minute .');
});

// function to get data
async function getApiData() {
  try{
    console.log(info, 'before getting the data');
    const response = await axios.get(endpoint);
    info = await response.data
    console.log(info, 'after getting the datat');
    console.log('Grabbing new API Stats');
    let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
    console.log('Api Date refreshed at' + date);
  } catch(e){
    console.log(e);
  }
}



app.get('/',async (req,res)=>{
  if (info === null) {
    console.log("info data not present, proceeding to run the getApiData function ");
    getApiData();
  }
  let date = new Date().toLocaleString("en-US", { timeZone: 'America/Chicago',hour12: true })
res.json({ data: info });
console.log('the api Data is being request at ' + date);
});


app.listen(port, () => {
  console.log(`example app is listenining port ${port}`);
});
