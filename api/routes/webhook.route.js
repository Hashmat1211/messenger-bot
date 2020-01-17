/* IMPORTING MODULES */
const express = require("express");
const webhookController = require("../controllers/webhook.controller");

/* CREATING A ROUTING FUNCTION */
const router = express.Router();

/* THIS IS A VERYIFICATION ROUTE. THIS WILL BE HIT BY FACEBOOK TO VERIFY */

router.get("/webhook", webhookController.verifyWebhook);

router.post("/webhook", webhookController.messageHandler);

module.exports = router;
