# Frontend

This module contains the web interface for managing mitmproxy rules.

## Features

- List existing rules.
- Create, edit, copy, and remove rules.
- Quickly activate/deactivate rules.
- Request and response modifications (headers, body, etc).
- Easy-to-use interface.

## File Structure

- `index.html`: Main HTML file for the interface.
- `main.js`: JavaScript logic for rule manipulation and backend API interaction.

## Prerequisites

- Backend API running locally (by default, expected at `http://localhost:8000`).

## How to Run

You can open the `index.html` file directly in your browser or run a simple HTTP server to avoid CORS issues:

```bash
python -m http.server 8000
```

Then, access [http://localhost:8000](http://localhost:8000) in your browser.

## Notes

- The frontend expects the backend to provide REST endpoints at `/rules`.
- For more information about mitmproxy filters, see the [official documentation](https://docs.mitmproxy.org/stable/concepts/filters/).
