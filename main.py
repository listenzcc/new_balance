# File: main.py
# Aim: Main python script

import http.server
import socketserver
from tools.read_excel import dataframe

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

if __name__ == '__main__':
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        print('serving at port', PORT)
        httpd.serve_forever()
