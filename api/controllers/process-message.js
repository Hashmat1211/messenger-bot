const fetch = require("node-fetch");
const chalk = require("chalk");
const {
  DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_CLIENT_EMAIL,
  PAGE_ACCESS_TOKEN
} = require("../dependencies/config");

const dialogflow = require("dialogflow");

// You can find your project ID in your Dialogflow agent settings
const projectId = "techsolagenet-mwvwew"; //https://dialogflow.com/docs/agents#settings
const sessionId = "2526";
const languageCode = "en-US";

const config = {
  credentials: {
    private_key: DIALOGFLOW_PRIVATE_KEY,
    client_email: DIALOGFLOW_CLIENT_EMAIL
  }
};

const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const FACEBOOK_ACCESS_TOKEN = PAGE_ACCESS_TOKEN;

const sendTextMessage = async (userId, text) => {
  try {
    return fetch(
      `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
      {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          messaging_type: "RESPONSE",
          recipient: {
            id: userId
          },
          message: {
            text
          }
        })
      }
    );
  } catch (error) {
    console.log("err in sendTextMessage ", error);
  }
};

const processMessageInDialogFlow = async webhook_event => {
  try {
    /* USER ID AND ITS MESSAGE FROM FACEBOOK CHATBOT */
    const userId = webhook_event.sender.id;
    const message = webhook_event.message.text;

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: languageCode
        }
      }
    };

    console.log(chalk.green.bold.inverse("request"), request);
    console.log(chalk.red.bold.inverse("changed everything to async"));
    const responses = await sessionClient.detectIntent(request);
    console.log(chalk.green.bold.inverse("responses"), responses);
    const result = responses[0].queryResult;
    console.log(chalk.green.bold.inverse("result"), result);
    return sendTextMessage(userId, result.fulfillmentText);
  } catch (error) {
    console.log("err in sendTextMessage ", error);
  }
};

module.exports = {
  processMessageInDialogFlow
};
