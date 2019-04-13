#!/usr/bin/python
# coding=utf-8
__author__ = "Aleksandr Shyshatsky"

import socket
s = socket.socket(socket.AF_INET,socket.SOCK_RAW,socket.IPPROTO_IP)
s.bind(("192.168.0.101", 8888))
s.setsockopt(socket.IPPROTO_IP,socket.IP_HDRINCL,1)
s.ioctl(socket.SIO_RCVALL, socket.RCVALL_ON)
while True:
    data = s.recvfrom(10000)
    print(data)
