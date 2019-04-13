#!/usr/bin/python           # This is server.py file
import getpass
import socket               # Import socket module
import struct
import threading


def on_new_client(clientsocket,addr):
    print('sending something')
    clientsocket.send(struct.pack('>I', 0x1A2B3C4D))
    clientsocket.send(bytes(getpass.getuser(), 'utf-8') + b'\x00')
    clientsocket.close()


s = socket.socket()
port = 8899

print('Server started!', '0.0.0.0')
print('Waiting for clients...')

s.bind(('0.0.0.0', port))        # Bind to the port
s.listen(5)                 # Now wait for client connection.

while True:
   c, addr = s.accept()     # Establish connection with client.
   print('Got connection from', addr)
   threading.Thread(target=on_new_client, args=(c, addr)).start()
