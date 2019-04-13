#!/usr/bin/python
# coding=utf-8
import json

from channels.auth import login
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

# noinspection PyCompatibility
from django.conf import settings
from django.contrib.auth.models import User, AnonymousUser
from django.db.models import Q

from chat.models import Message, ImageUpload


class UserEventsConsumer(AsyncJsonWebsocketConsumer):
    ROOM_GROUP_NAME = 'user_%s'

    def get_group_name(self):
        return self.ROOM_GROUP_NAME % self.scope['user'].id

    async def connect(self):
        await self.accept()
        if self.scope['user'].id:
            # successful login
            await self.channel_layer.group_add(
                self.get_group_name(),
                self.channel_name
            )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.get_group_name(),
            self.channel_name
        )

    @classmethod
    async def decode_json(cls, text_data):
        return json.loads(text_data)

    @classmethod
    async def encode_json(cls, content):
        print(content)
        return json.dumps(content)

    async def send_message(self, message: Message, all=True):
        msg = {
            'event': 'message_%s' % message.chat_id,
            'data': {
                "message_id": message.id,
                "from": {
                    "name": message.user.username,
                    "avatar": "https://api.adorable.io/avatars/%s" % message.user.id
                },
                "content": {
                    "type": message.content_type,
                    "payload": message.content
                },
                "action": None
            }
        }
        if all:
            id1 = message.chat_id & 0b0001111
            id2 = message.chat_id >> 4
            await self.channel_layer.group_send(
                self.ROOM_GROUP_NAME % id1, {'type': 'receive_message', 'payload': msg})
            await self.channel_layer.group_send(
                self.ROOM_GROUP_NAME % id2, {'type': 'receive_message', 'payload': msg})
        else:
            await self.channel_layer.group_send(
                self.ROOM_GROUP_NAME % self.scope['user'].id, {'type': 'receive_message', 'payload': msg})

    async def receive_json(self, content, **kwargs):
        """
        Called with decoded JSON content.
        """
        content = json.loads(content)
        print(content)
        if content['event'] == 'whoami':
            if self.scope['user'].id:
                await self.send_json({'event': 'login', 'data': {
                    'success': True,
                    'user_id': self.scope['user'].id,
                    'username': self.scope['user'].username,
                    'session': str(self.scope["session"].session_key)
                }})
            else:
                await self.send_json({'event': 'login', 'data': {
                    'success': False,
                    'errorMessage': "not logged in"
                }})

        if content['event'] == 'login':
            try:
                user = User.objects.get_by_natural_key(content['data']['login'])
            except User.DoesNotExist:
                await self.send_json({'event': 'login', 'data': {
                    'success': False,
                    'errorMessage': "no such user"
                }})
                return

            if user.check_password(content['data']['password']):
                # login the user to this session.
                await login(self.scope, user)
                # save the session (if the session backend does not access the db you can use `sync_to_async`)
                await database_sync_to_async(self.scope["session"].save)()
                await self.send_json({'event': 'login', 'data': {
                    'success': True,
                    'user_id': self.scope['user'].id,
                    'username': self.scope['user'].username,
                    'session': str(self.scope["session"].session_key)
                }})
                # successful login
                await self.channel_layer.group_add(
                    self.get_group_name(),
                    self.channel_name
                )
            else:
                await self.send_json({'event': 'login', 'data': {
                    'success': False,
                    'errorMessage': "invalid password, try again"
                }})
        elif content['event'] == 'chats':
            chats = []
            for user in User.objects.all():
                id1 = min([user.id, self.scope['user'].id])
                id2 = max([user.id, self.scope['user'].id])
                chats.append({
                    'id': user.id,
                    'chat_id': (id1 | id2 << 4),
                    'name': user.username,
                    'avatar': 'https://api.adorable.io/avatars/%s' % user.id
                })
            await self.send_json({'event': 'chats', 'data': chats})
        elif content['event'] == 'chat_ready':
            print('client ready, send all messages')
            messages = Message.objects.filter(
                chat_id=content['data']['chat_id'])
            for message in messages.all():
                await self.send_message(message, all=False)
        elif content['event'] == 'message':
            message_data = content['data']
            if message_data['type'] == 'text':
                message = Message.objects.create(
                    content_type='text',
                    content=message_data['message'],
                    user=self.scope['user'],
                    chat_id=message_data['chat_id']
                )
            elif message_data['type'] == 'image':
                message = Message.objects.create(
                    content_type='image',
                    content=settings.BACKEND_URL +
                            ImageUpload.objects.get(pk=message_data['message']).file.url,
                    user=self.scope['user'],
                    chat_id=message_data['chat_id']
                )
            await self.send_message(message)

    async def receive_message(self, event):
        print('event', event)
        await self.send_json(event['payload'])
