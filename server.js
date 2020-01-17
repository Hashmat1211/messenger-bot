"use strict";

/* IMPORTING MODULES */
const https = require("https");
setInterval(function() {
  https.get("https://yours.herokuapp.com");
}, 300000); // 5 Minutes

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connetdb = require("./api/dependencies/connectdb");
const cors = require("./api/dependencies/cors");

/* MONGODB CONNECTION */

connetdb();
/* helper functions  */

/* MIDDLEWARES */

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*  HANDLING CORS */

app.use(cors);

/*  ROUTE */
app.get("/", (req, res) => {
  res.send("working fine 2");
});

const webhookRoutes = require("./api/routes/webhook.route");

app.use("/", webhookRoutes);

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
app.listen(process.env.PORT || port, function() {
  console.log("Node server is up and running.. on ", port);
});
