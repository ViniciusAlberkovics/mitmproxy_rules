# Addon Script

This module contains the mitmproxy addon script, responsible for intercepting and modifying HTTP requests and responses according to configurable rules.

## Files

- `interceptor.py`: Main addon script, responsible for:
  - Loading rules from a YAML file defined by the `RULES_FILE` environment variable.
  - Monitoring changes in the rules file and automatically reloading it.
  - Modifying URLs, headers, and body of HTTP requests according to rules.
  - Modifying headers and body of HTTP responses according to rules.
  - Supporting full or partial replacements of message bodies.

## How to Run

To run the addon, use the command below, specifying the path to the rules file:

```bash
RULES_FILE=rules.yaml mitmweb -s interceptor.py
```

## Example Rule

```yaml
- description: "Modification example"
  filter: "http"
  active: true
  url_replace:
    old: "example.com"
    new: "test.com"
  request_mod:
    headers:
      X-Test: "true"
    full_body_replace: '{"foo": "bar"}'
  response_mod:
    headers:
      X-Intercepted: "yes"
    body_replace:
      - from: "foo"
        to: "baz"
```

## Notes

- The rules file must be in YAML format.
- Rules can be enabled/disabled individually with the `active` field.
- The filter uses the `mitmproxy.flowfilter` syntax.
