#!/bin/bash
set -e

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput

daphne -b 0.0.0.0 -p 10001 django_chat.asgi:application