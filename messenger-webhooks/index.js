/*
'use strict';


// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
*/


'use strict';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server



// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));



//////////////////////


// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = webhook_event.sender_id;
      console.log('Sender ID: ' + sender_psid);

      if(webhook_event.message){
        messageHandler(sender_psid, webhook_event.message);
      }else if (webhook_event.postback) {
        postbackHandler(sender_psid, webhook_event.postback);
      }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});



// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "<AP_VERIFY_TOKEN>"

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});



function handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message.text) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}



function messageHandler(sender_psid, message) {

  let response;

  // Checks if the message contains text

  if (message.text) {

    // Create the payload for a basic text message, which

    // will be added to the body of our request to the Send API

    response = {

      "text": `You sent the message: "${message.text}". Now send me an attachment!`

    }

  } else if (message.attachments) {

    // Get the URL of the message attachment

    let attachment_url = message.attachments[0].payload.url;

    response = {

      "attachment": {

        "type": "template",

        "payload": {

          "template_type": "generic",

          "elements": [{

            "title": "Is this the right picture?",

            "subtitle": "Tap a button to answer.",

            "image_url": attachment_url,

            "buttons": [

              {

                "type": "postback",

                "title": "Yes!",

                "payload": "yes",

              },

              {

                "type": "postback",

                "title": "No!",

                "payload": "no",

              }

            ],

          }]

        }

      }

    }

  }



  // Send the response message

  SenderAPI(sender_psid, response);

}



function postbackHandler(sender_psid, postback) {

  console.log('ok')

   let response;

  // Get the payload for the postback

  let payload = postback.payload;



  // Set the response based on the postback payload

  if (payload === 'yes') {

    response = { "text": "Thanks!" }

  } else if (payload === 'no') {

    response = { "text": "Oops, try sending another image." }

  }

  // Send the message to acknowledge the postback

  SenderAPI(sender_psid, response);

}




function SenderAPI(sender_psid, response) {

  // Construct the message body

  let request_body = {

    "recipient": {

      "id": sender_psid

    },

    "message": response

  }



  // Send the HTTP request to the Messenger Platform

  request({

    "uri": "https://graph.facebook.com/v2.6/me/messages",

    "qs": { "access_token": PAGE_ACCESS_TOKEN },

    "method": "POST",

    "json": request_body

  }, (err, res, body) => {

    if (!err) {

      console.log('message sent!')

    } else {

      console.error("Unable to send message:" + err);

    }

  });

}








//webhook Tests

//curl -X GET "localhost:1337/webhook?hub.verify_token=<YOUR_VERIFY_TOKEN>&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"


//curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'











/**/
