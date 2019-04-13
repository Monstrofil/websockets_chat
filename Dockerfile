FROM python:3.7-alpine3.8

# in order to install package from github
RUN apk update && apk upgrade && \
    apk add --no-cache git

# in order to install psycopg2
RUN \
 apk add --no-cache --virtual .build-deps \
  gcc musl-dev libxml2-dev libxslt-dev \
  musl-dev linux-headers make bash nodejs nodejs-npm

RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/main openssl

ADD requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt

ADD . /app

RUN cd /app/client/src && npm install && npm run-script build

WORKDIR /app