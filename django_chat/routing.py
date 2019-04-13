#!/usr/bin/python
# coding=utf-8
from channels.auth import AuthMiddlewareStack

import chat.routing


from channels.routing import ProtocolTypeRouter, URLRouter

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
