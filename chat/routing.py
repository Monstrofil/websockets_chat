#!/usr/bin/python
# coding=utf-8
from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^ws/user/$', consumers.UserEventsConsumer),
]