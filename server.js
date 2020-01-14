/* IMPORTING MODULES */

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const connetdb = require("./api/dependencies/connectdb");
const cors = require("./api/dependencies/cors");

/* MONGODB CONNECTION */

connetdb();

/* MIDDLEWARES */

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*  HANDLING CORS */

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

/*  ROUTE */

app.get("/", function(req, res) {
  console.log("hi");
  res.send("Hello world!");
});

/* THIS IS A VERYIFICATION ROUTE. THIS WILL BE HIT BY FACEBOOK TO VERIFY */
app.get("/mybot", function(req, res) {
  if (req.query["hub.verify_token"] === "THIS_IS_MY_VERIFICATION_TOKEN") {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Wrong token!");
});

/* HANDLING ERROR MIDDLEWARES */

app.use((req, res, next) => {
  const err = new Error("Yakh Pakh");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

const port = 6000;

/* lISTENING PORT */
app.listen(port, function() {
  console.log("Node server is up and running.. on ", port);
});
