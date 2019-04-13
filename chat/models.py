from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class ImageUpload(models.Model):
    file = models.FileField()


class Message(models.Model):
    CONTENT_TYPES = [
        ('text', 'text'),
        ('image', 'image'),
        ('url', 'url'),
    ]
    content_type = models.CharField(choices=CONTENT_TYPES, max_length=10)
    content = models.TextField()
    chat_id = models.IntegerField(default=0)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
