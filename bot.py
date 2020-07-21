FACEBOOK_GRAPH_URL = 'https://graph.facebook.com/v2.6/me/'

class Bot (object):
    def __init__(self, access_token, api_url= FACEBOOK_GRAPH_URL):
        self.access_token =access_token
        self.api_url =api_url

        def send_text_message(self, psid, message, messaging_type="RESPONSE"):
        #headers = {
    #'Content-Type': 'application/json'
}
data = {
    'messaging_type': messaging_type,
    'recipient': {'id':psid},
    'message':{'text':message}
}

params = {'access_token': self_access_token}
self.api_url = self.api.url + 'messages'
response = requests.post(self.ai.url,
headers=headers, params=params,
data=json.dumps(data))

print (response,content)


bot= Bot('')
Bot.send_text_message ()
# curl -X
# POST - H
# "Content-Type:application/json" - d
# '{
# "messaging_type": "<MESSAGING_TYPE>",
#  "recipient":{
#     "id":"<PSID>"
# },
#  "message":{
#      "text": "hello, world!"
# }
# }' "https://graph.facebook.com/v2.6/me/messages?access_token=<PAGE_ACCESS_TOKEN>"
