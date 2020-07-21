import json

from flask import Flask,request

from bot import Bot

PAGE_ACCESS_TOKEN=''
GREETINGS = ['Hi', 'Hello', 'Hiya', 'How are you?',]

app=Flask(__name__)


@app.route('/',methods=['GET','POST'])
def webhook():

    if request.method == 'GET':
        token = request.args.get('hub_verify_token')
        challenge =reques.args.get('hub.challege')
        if token == 'secret':
                return str(challenge)
            #return '400'

            else:
                data = json.loads(request.data)
            messaging_events =data['entry'][0]['messaging']
            bot = Bot (PAGE_ACCESS_TOKEN)
            for message in messaging_events:
                user_id = message ['sender'][id]
                text_input = message['message'].get('text')
                response_text = 'I am still learning '
                if text_input in GREETINGS:
                    response_text ='Hello. How ae you today?'
                print('Message from user ID {} - {}'.format(user_id,text_input))
                bot.send_text_message(user_id,response_text)

            return '200'
                
                

            
            if __name__ =='__main__':
               
                app.run(debug=True)
