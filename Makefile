run-addon:
	RULES_FILE=$$(pwd)/rules.yaml mitmweb -s addon/interceptor.py --listen-port 9000

run-backend:
	RULES_FILE=$$(pwd)/rules.yaml uv run -- fastapi dev backend/api_server.py

run-frontend:
	python -m http.server 8001 --directory frontend
