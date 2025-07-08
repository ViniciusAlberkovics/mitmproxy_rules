# Backend

This module contains the API server and the main logic for mitmproxy rules.

## Files

- `api_server.py`: API server.
- `rules.example.yaml`: Example rules file.
- `shared/utils.py`: Utility functions.

## How to Run

To run the backend, use the command:

```bash
RULES_FILE=rules.yaml uv run -- fastapi dev api_server.py
```

## API Endpoints

### `GET /rules`

Returns the list of loaded rules.

**Example response:**

```json
[
  {
    "active": true,
    "description": "Replace Status to OPEN",
    "filter": "~m GET https://example.com",
    "response_mod": { "full_body_replace": "{\"status\":\"OPEN\"}" }
  }
]
```

---

### `POST /rules`

Adds a new rule.

**Body:**  
JSON object representing the rule.

**Example body:**

```json
{
  "active": true,
  "description": "New rule",
  "filter": "~m GET https://api.site.com",
  "response_mod": { "full_body_replace": "{\"ok\":true}" }
}
```

**Response:**

```json
{ "status": "ok" }
```

---

### `PUT /rules/{index}`

Updates an existing rule by index.

**Parameters:**

- `index` (int): Index of the rule to update.

**Body:**  
JSON object representing the new rule.

**Response:**

```json
{ "status": "ok" }
```

---

### `DELETE /rules/{index}`

Removes a rule by index.

**Parameters:**

- `index` (int): Index of the rule to remove.

**Response:**

```json
{ "status": "ok" }
```
