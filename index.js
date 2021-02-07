const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
let port = process.env.PORT || 8080;


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

app.get('/',(req,res)=>{
  res.send('This is the base route!');
  res.json({ username: 'Flavio' });
  console.log('this is base route test');
});



app.listen(port, () => {
  console.log(`example app is listenining port ${port}`);
  console.log(process.env);
});
