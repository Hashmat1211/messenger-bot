/* IMPORTING MODULES */
const chalk = require("chalk");
const request = require("request");
const config = require("../dependencies/config");

const verifyWebhook = async (req, res, next) => {
  try {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "this_is_a_secret_token";

    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    // console.log("mode \n", mode);
    // console.log("token \n", token);
    // console.log("challenge\n", challenge);

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
  } catch (error) {
    console.log("err in verify webhook ", error);
  }
};

/* HANDLER FOR SENDING AND RECEIVING MESSAGES TO FACEBOOK MESSENGER CHATBOT */

const messageHandler = async (req, res, next) => {
  try {
    let body = req.body;
    console.log("\n body \n", body);
    // return res.status(200).send(`O K`);
    // Checks this is an event from a page subscription
    if (body.object === "page") {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        /*
          - Gets the message. entry.messaging is an array, but
            will only ever contain one message, so we get index 0

          - Gets the body of the webhook event                     */
        console.log("messaging ", entry.messaging);
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);
        sendTextMessage(sender_psid, "intazar kejyea");
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send("EVENT_RECEIVED");
    }
  } catch (error) {
    console.log("err in post webhook ", error);
  }
};

function sendTextMessage(sender, text) {
  var messageData = {
    text: text
  };
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: {
        access_token: config.PAGE_ACCESS_TOKEN
      },
      method: "POST",
      json: {
        recipient: {
          id: sender
        },
        message: messageData
      }
    },
    function(error, response, body) {
      if (error) {
        console.log("Error:", error);
      } else if (response.body.error) {
        console.log("Error: ", response.body.error);
      }
    }
  );
}

module.exports = {
  verifyWebhook,
  messageHandler
};
