const express = require("express");
const axios = require('axios');
const cors = require('cors');
const bodyParser = require("body-parser");

const endpoint = `https://api.sportradar.us/nba/trial/v7/en/seasons/2020/REG/leaders.json?api_key=${process.env.REACT_APP_KEY}`
let port = process.env.PORT || 8080;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.get('/',async (req,res)=>{

  try {
    const response = await axios.get(endpoint)
    const data = await response.data
    console.log(data,'this is the data');
    res.json({ stats: data })
  } catch (error) {
    //this will eventually be handled by your error handling middleware
    console.log(error);
  }
});



app.listen(port, () => {
  console.log(`example app is listenining port ${port}`);
});
