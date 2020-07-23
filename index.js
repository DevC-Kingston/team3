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
			sendText(sender, "Your message: " + text.substring(0, 100))
		}
	}

	res.sendStatus(200);
})



function sendText(sender, text){
	let data = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: app_token},
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



app.listen(app.get('port'), function(){
	console.log("Port active")

})












