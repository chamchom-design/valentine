
import http.server
import socketserver
import webbrowser
import threading
import sys

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}/"
    print(f"Serving HTTP on {url} (press CTRL+C to stop)")
    threading.Timer(0.7, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
