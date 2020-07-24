'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

//allow data processing
app.use(bodyParser.urlencoded({extend: false}))

app.use(bodyParser.json())

//route
app.get('/', function(req, res) {
	res.send("Hi there!")
})


//let app_token = "EAAEkXLChDsMBAHE6xd2tt86DYcU9t9AVY1JHXfpmZCXn6ZCzmMS06ju4TS6tHBZAIU8jPOqat44DZAZBh8LQSZA0IHBt8p4Yi1AFpeuQFpqG381ZAkSHjccVedAiSHL0TUIMb2cUCkMiLDx4HY0KaL6fYwIhZC4fL8wDd8CSdxICC3TeZBgwAO8Ys"

//let barnaby_token = "EAAEU5gpE1W0BAFtP2XpK548KUPm5pRDFreDemZALZAuuOUa6DW9O6oQZBkpRaZBnLZAyGI0ob2HJWtZBTjtO81gDOLM7ZCURoGLE5w11SOe8hy6wCN3v6uNxBnUKRedXTZBBDi7e68GnbE3zCYKvqIA2e33lLR2aZCqXWZBUhTM9wRQ1cWzM1DCtQQ"

let q_token = "EAAEkXLChDsMBAHPeqbxE2SZAZA8CZCJxsAd78TJhPEhkgmtiADSO7ids8wJmRjSJZA0MtLBWKo2QwHAifmXUL5AQ55UYdL9QKnHWJiWEDRxhPaz3iiOa8C4u2oBRSHYp6K17W0d83DjqvieQGTJYcmmAnMZCuRrkd8d6yyt08ZBatJwQt6KH93"

let greetings = ["Hi", "HI", "hi", "Hello", "HELLO", "hello", "Hi How are you", "What's up", "Sup", "SUP", "sup"];

let greeting_response = ["Hi I'm Barnaby, How can I assist?", "Hello, how may I help you today?", "Hi there. How may I help you today?"]

let q_reporting = ["Report account missuse","Report account theft",	"Report account fraud"]

let q_report = ["Report account missuse","Report account theft","Report account fraud","report account missuse","report account theft","report account fraud", "REPORT ACCOUNT MISSUSE", "REPORT ACCOUNT FRAUD", "REPORT ACCOUNT THEFT"]


let q_platforms = [
	"INSTAGRAM",
	"FACEBOOK",
	"TWITTER",
	"TIKTOK",
	"TINDER",
	"SNAPCHAT",
	"instagram",
	"facebook",
	"twitter",
	"tiktok",
	"tinder",
	"snapchat"
]


let r_platforms = [
	"INSTAGRAM",
	"FACEBOOK",
	"TWITTER",
	"TIKTOK",
	"TINDER",
	"SNAPCHAT"
]


//fb route

app.get('/webhook', function(req, res){

	const VERIFY_TOKEN = "<AP_VERIFY_TOKEN>"

	// Parse the query params
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	if(req.query['hub.verify_token'] === VERIFY_TOKEN){
		res.send(challenge)
		res.status(200).send(challenge);
	}

	res.sendStatus(403);


})


app.post('/webhook/', function(req, res){
	let messaging_events = req.body.entry[0].messaging

	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id

		if(event.message && event.message.text) {
			let text = event.message.text
			
			for (var l of greetings) {
				
				if(text.includes(l)) { //if the message text conatins a gretting, respond with a greeting from the greeting_response array 
					let num = Math.floor(Math.random() * greeting_response.length); //generates a random number from 0 - max of greeting_response array
					let msg = greeting_response[num]; //sets a random response from the greeting_response array to the message variable 
															
					sendText(sender, msg); //sends the response to the recipient

					let q_rep = ""
					for(var x of q_reporting) {
						if(q_rep === "" || q_rep.length === 0 || q_rep === null){
							q_rep = q_rep.concat(x) //adds an initial complaint type to the empty string
						}else{
							q_rep = q_rep.concat(" | " + x) //adds the remaining complaint types
						}
					}
					sendText(sender, q_rep); //displays the various types of complaints to the user

				}
			}


			for(var r of q_report){

				if(text.includes(r)) { //if the message text conatins a complaint type, add each platform name to the plats variable 
					let a_rep = "Okay, I can help you with that.";
					sendText(sender, a_rep);

					a_rep = "On which social media platfrom do you have this issue?";
					sendText(sender, a_rep);

					let plats = ""
					for(var x of r_platforms) {
						if(plats === "" || plats.length === 0 || plats === null){
							plats = plats.concat(x)
						}else{
							plats = plats.concat(" | " + x)
						}
					}

					sendText(sender, plats); //display the various platforms to the user

				}

			}


			for (var p of q_platforms){

				if(text.includes(p)) { 
					let msg = "Okay.";
					sendText(sender, msg);

					msg = "Could you confirm the user name of the account.";
					sendText(sender, msg);

				}

			}


			if(text.includes("@")) {

				let msg = "Okay, we will submit the request on your behalf";
				sendText(sender, msg);

				msg = "Please complete the Consent Note Verification Form and Document Verification form";
				sendText(sender, msg);

				msg = "Here's the link: www.tiktokreportmaintain.com";
				sendText(sender, msg);

			}


		}

	}

	res.sendStatus(200);
})



function sendText(sender, text){
	let data = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: q_token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : data
		}

	}), function(error, response, body) {
		if(error){
			console.log("sending error")
		}else if (response.body.error){
			console.log("response body error")
		}
	}
}




/*
function messageHandler(sender, text){
	
	let handlerData = {text: text}

	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: q_token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : handlerData
		}

	}), function(error, response, body) {
		if(error){
			console.log("sending error")
		}else if (response.body.error){
			console.log("response body error")
		}
	}

	
}
*/



app.listen(app.get('port'), function(){
	console.log("Port active")

})












