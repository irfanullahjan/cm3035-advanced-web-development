import json
from channels.generic.websocket import WebsocketConsumer
from datetime import datetime


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        message = text_data_json['message']
        username = text_data_json['username']
        self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'timestamp': datetime.now().strftime('%H:%M hrs')
        }))
