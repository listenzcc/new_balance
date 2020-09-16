# File: main.py
# Aim: Main python script

import http.server
import socketserver
import webbrowser
import threading
from tools.read_excel import dataframe


class HTTPServer(object):
    def __init__(self, PORT=8000, Handler=http.server.SimpleHTTPRequestHandler):
        self.PORT = PORT
        self.Handler = Handler
        self.httpd = socketserver.TCPServer(('', self.PORT), self.Handler)

    def serve_forever(self):
        print('serving at port', self.PORT)
        self.httpd.serve_forever()

    def start(self):
        t = threading.Thread(target=self.serve_forever)
        t.setDaemon(True)
        t.start()


if __name__ == '__main__':
    server = HTTPServer()
    server.start()
    webbrowser.open('http://localhost:8000/src/index.html')
    while True:
        inp = input('>> ')
        if inp == 'q':
            break

    print('Bye!')
