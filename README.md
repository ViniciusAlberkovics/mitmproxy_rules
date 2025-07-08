run:

uv run -- fastapi dev api_server.py

mitmproxy:

mitmweb --listen-port 9000 -s interceptor.py;
