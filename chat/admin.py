from django.contrib import admin
from .models import Message, ImageUpload

admin.site.register(Message)
admin.site.register(ImageUpload)
