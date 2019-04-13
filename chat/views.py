import json

from django.contrib.auth.models import User
from django.forms import forms, ModelForm
from django.shortcuts import render, HttpResponse

from chat.models import ImageUpload


class UploadFileForm(ModelForm):
    class Meta:
        model = ImageUpload
        fields = ['file']


def upload_image(request):
    if request.method != 'POST':
        raise NotImplementedError()
    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid():
        photo = form.save(commit=True)
        return HttpResponse(content_type='application/json', content=json.dumps({
            'photo_id': photo.id
        }))
    print(form.errors)
    return HttpResponse(status=400)


def whoami(request):
    return HttpResponse(content_type='application/json', content=json.dumps({
        'id': request.user.id,
        'is_active': request.user.is_active
    }))
