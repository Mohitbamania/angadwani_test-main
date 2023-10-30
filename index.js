require("dotenv").config();
const Op = require("sequelize").Op;
const path = require('path')
const {
  sequelize,
} = require("./models");
const express = require("express");
var browser = require("browser-detect");
const app = express();
var cors = require("cors");
var http = require("http").createServer(app);
app.use(express.urlencoded({limit: '128mb'}));

app.use(cors());
app.use(express.json({limit: '128mb'}));

const routing = require('./routing');

// routing: app version v1 
app.use('/api/v1/', routing);
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '128mb',extended: true }));


http.listen(process.env.PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected");
    console.log(`server running on port ${process.env.PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
