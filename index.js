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


let app_token = "EAAEkXLChDsMBAHE6xd2tt86DYcU9t9AVY1JHXfpmZCXn6ZCzmMS06ju4TS6tHBZAIU8jPOqat44DZAZBh8LQSZA0IHBt8p4Yi1AFpeuQFpqG381ZAkSHjccVedAiSHL0TUIMb2cUCkMiLDx4HY0KaL6fYwIhZC4fL8wDd8CSdxICC3TeZBgwAO8Ys"

let barnaby_token = "EAAEU5gpE1W0BAFtP2XpK548KUPm5pRDFreDemZALZAuuOUa6DW9O6oQZBkpRaZBnLZAyGI0ob2HJWtZBTjtO81gDOLM7ZCURoGLE5w11SOe8hy6wCN3v6uNxBnUKRedXTZBBDi7e68GnbE3zCYKvqIA2e33lLR2aZCqXWZBUhTM9wRQ1cWzM1DCtQQ"

let q_token = "EAAEkXLChDsMBALBeKlqiSskg9HMkEbRYQpN7dtwp2ZA6uLDcdtRqbUlfHRzzgspmH8bJ5FUPPwKLDvvt6Cea0jUp8tAIZC7Ej9Tst4v7fjOMFeRcAeiqY3APybwjPY7IgIKtc1hxmv2FwZClfDdK7W2H8qsxToAbZBy3yTcUGv6hzk03KuoE"

let greetings = ["Hi", "hi", "HI", "hello", "Hello", "HELLO", "How are you", "What's up", "sup", "Sup", "SUP"];

let greeting_response = ["Hi I'm Barnaby, How can I assist?", "Hello, how may help you today?", "Hi there. How may I help you today?"]

let q_reporting = ["I would like to report account missuse","I would like to report account theft",	"I would like to report account fraud"]


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

		if(event.message && event.message.text){
			let text = event.message.text
			//sendText(sender, "Your message: " + text.substring(0, 100))
			//sendText(sender, "send text: "+text.substring(0, 100))
			//messageHandler(sender, "handler: " + text.substring(0, 100))
			
			for (var l of greetings){
				if(text.includes(l)) {
					let num = Math.floor(Math.random() * greeting_response.length); 
					let msg = greeting_response[num];
					messageHandler(sender, msg);

				}
			}


			for(var r of q_reporting){

				if(text.includes(r)) { 
					let a_rep = "Okay, I can help you with that";
					messageHandler(sender, a_rep);

					let sec = "On which social media platfrom do you have this issue?";
					sendText(sender, sec);
					

				}

			}


			for (var p of q_platforms){

				if(text.includes(p)) { 
					let msg = "Okay";
					messageHandler(sender, msg);

					msg = "Could you confirm the user name of the account";
					sendText(sender, msg);

				}

			}


			if(text.includes("@")) {

				let msg = "Okay, please complete the Consent Note Verification and Document Verification form";
				messageHandler(sender, msg);

				msg = "Here's the link: www.tiktokreportmaintain.com";
				sendText(sender, msg);

			}


		}

		/*
		if(event.message && event.message.text){
			let text = event.message.text
			
		}
		else
		

		if (event.postback) {
			postbackHandler(sender, event.postback)
		}
		*/

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





function messageHandler(sender, text){
	let luta;
	let handlerData = {text: text}

	
	/*
	for (var i = 0; i < greetings.length; i++) {
		if (msg === "Hi" || msg === "Hello") {
			msg_response = greeting_response[i];
		}
		if (text.includes("Hi") || text.includes("Hello")) {
				
			}
	}
	*/

	//luta = greeting_response[1]

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




app.listen(app.get('port'), function(){
	console.log("Port active")

})












