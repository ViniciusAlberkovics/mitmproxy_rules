# mitmproxy_rules

## Description

This project aims to centralize and organize custom rules for use with [mitmproxy](https://mitmproxy.org/), a powerful tool for intercepting, inspecting, modifying, and replaying HTTP(S) traffic. The rules allow automating request and response manipulations, making it easier to perform testing, debugging, and automation in development and QA environments.

## Installation

1. **Clone the repository:**

   ```sh
   git clone git@github.com:ViniciusAlberkovics/mitmproxy_rules.git
   cd mitmproxy_rules
   ```

2. **Install [uv](https://github.com/astral-sh/uv) (if not already installed):**

   ```sh
   pip install uv
   ```

3. **Install project dependencies using `uv` and `pyproject.toml`:**

   ```sh
   uv pip install -r pyproject.toml
   ```

   Or, to install in editable/development mode:

   ```sh
   uv pip install -e .
   ```

   > **Note:** This project uses the `uv` project structure with `pyproject.toml` and `uv.lock` for dependency management. There is no `requirements.txt`.

4. **Install mitmproxy:**

   Follow the official instructions at [mitmproxy installation guide](https://docs.mitmproxy.org/stable/overview/installation/).

## Running the Project

You can run each component separately. Use the provided `Makefile` for convenience.

### 1. Run the mitmproxy Addon

This will start mitmweb with the custom interceptor addon and load rules from `rules.yaml`:

```sh
make run-addon
```

Or manually:

```sh
RULES_FILE=$(pwd)/rules.yaml mitmweb -s addon/interceptor.py --listen-port 9000
```

### 2. Run the Backend API

This will start the FastAPI backend for managing rules:

```sh
make run-backend
```

Or manually:

```sh
RULES_FILE=$(pwd)/rules.yaml uv run -- fastapi dev backend/api_server.py
```

### 3. Run the Frontend

This will start a simple HTTP server to serve the frontend:

```sh
make run-frontend
```

Or manually:

```sh
python -m http.server 8001 --directory frontend
```

## Project Structure

```
mitmproxy_rules/
├── addon/         # Addon scripts for mitmproxy (automate the rules)
├── backend/       # Backend API to manage rules (FastAPI)
├── frontend/      # Web interface to create/edit rules
├── shared/        # Utilities shared between backend and addon
├── README.md      # Main project documentation
```

### Purpose of Each Folder

- **addon/**: Contains scripts that are loaded as addons in mitmproxy, applying the defined rules to intercepted traffic.
- **backend/**: Implements an API (using FastAPI) for reading, writing, and editing rules, facilitating integration with the frontend.
- **frontend/**: Web interface for viewing, creating, and editing rules in a user-friendly way.
- **shared/**: Utility functions and modules shared between the backend and addon, such as loading and saving rules.
- **README.md**: This documentation file.
