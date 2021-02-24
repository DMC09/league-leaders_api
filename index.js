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



cron.schedule('* * * * *', function() {
  console.log('running a task every minute');
  console.log(info,'this is the info read from the cron job');
});

//main endpoint.
app.get('/',async (req,res)=>{
try{
  const response = await axios.get(endpoint);
  const info = await response.data
  console.log(info,'this is the info when I hit the endpoint');

    // res.json({ username: 'Flavio' });
    res.json({ data: info });

} catch(e){
  console.log(e);
}
});


app.listen(port, () => {
  console.log(`example app is listenining port ${port}`);
});
