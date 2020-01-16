"use strict";

/* IMPORTING MODULES */

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const connetdb = require("./api/dependencies/connectdb");
const cors = require("./api/dependencies/cors");
var PAGE_ACCESS_TOKEN =
  "EAAMINrDZAmQUBAGKLDah4vMqb9Boe747GKpp73k8OSZCvnNQA4uDZC6uU1kxJaJDEETmXRO4n7QrHrKftlQTpL9zHYCCKkzrfMgumVV1J7v1r8N8epIsCOo6fMl46q3fKFuLmyg1UO5ZCZA6A3C3ChvEbAErRq7YUSiEYDold0QZDZD";

/* MONGODB CONNECTION */

connetdb();
/* helper functions  */

// Handles messages events
function handleMessage(sender_psid, received_message) {}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {}

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
app.get("/", (req, res) => {
  res.send("ok 2");
});

/* THIS IS A VERYIFICATION ROUTE. THIS WILL BE HIT BY FACEBOOK TO VERIFY */

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "this_is_a_secret_token";

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  console.log("mode \n", mode);
  console.log("token \n", token);
  console.log("challenge\n", challenge);

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match

      console.log("WEBHOOK_IS_NOT_VERIFIED");

      res.sendStatus(403);
    }
  }
});

// Creates the endpoint for our webhook
app.post("/webhook", async (req, res) => {
  try {
    let body = req.body;
    console.log("jal;sdkfjl;");
    console.log(chalk.green.inverse("body"), body);

    // Checks this is an event from a page subscription
    if (body.object === "page") {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        /* 
          - Gets the message. entry.messaging is an array, but
            will only ever contain one message, so we get index 0
  
          - Gets the body of the webhook event
                                                                  */
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send("EVENT_RECEIVED");
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(chalk.blue.bold.inverse("\n error in server "));
    console.log(error);
  }
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
app.listen(process.env.PORT || port, function() {
  console.log("Node server is up and running.. on ", port);
});
