import socket
import sys

# Create a TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect the socket to the port on the server given by the caller
server_address = ('localhost', 8899)
print('connecting to %s port %s' % server_address)
sock.connect(server_address)

try:
    data = sock.recv(4)
    print('received "%s"' % data.hex())
    b = b''
    message = b''
    while b != b'\x00':
        message += b
        b = sock.recv(1)
    print('received "%s"' % message)

finally:
    sock.close()