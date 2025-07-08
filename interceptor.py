from utils import load_rules, rules_file_modified_since_last_load
from mitmproxy import http, flowfilter, ctx

RULES_FILE = "/home/zweideveloper/Desktop/projects/mitmproxy_rules/rules.yaml"

class Interceptor:
    rules = load_rules(RULES_FILE)

    def reload_rules_when_necessary(self) -> None:
        if rules_file_modified_since_last_load(RULES_FILE):
            ctx.log.info("Rules file modified, reloading rules.")
            self.rules = load_rules(RULES_FILE)

    def request(self, flow: http.HTTPFlow) -> None:
        self.reload_rules_when_necessary()
        for rule in self.rules:
            if not rule.get("active", True):
                continue
            matcher = flowfilter.parse(rule["filter"])
            if matcher(flow):
                if "url_replace" in rule:
                    flow.request.url = flow.request.url.replace(rule["url_replace"]['old'], rule["url_replace"]['new'])
                req_mod = rule.get("request_mod", {})
                for k, v in req_mod.get("headers", {}).items():
                    flow.request.headers[k] = v
                if "full_body_replace" in req_mod:
                    flow.request.set_text(req_mod["full_body_replace"])
                else:
                    for r in req_mod.get("body_replace", []):
                        if flow.request.text:
                            flow.request.set_text(flow.request.get_text().replace(r["from"], r["to"]))

    def response(self, flow: http.HTTPFlow) -> None:
        self.reload_rules_when_necessary()

        for rule in self.rules:
            if not rule.get("active", True):
                continue
            ctx.log.info(f"Processing rule: {rule['description']}")
            matcher = flowfilter.parse(rule["filter"])
            if matcher(flow):
                ctx.log.info(f"Rule matched: {rule['description']}")
                res_mod = rule.get("response_mod", {})
                for h in ["cache-control", "expires", "pragma"]:
                    flow.response.headers.pop(h, None)
                for k, v in res_mod.get("headers", {}).items():
                    flow.response.headers[k] = v
                if "full_body_replace" in res_mod:
                    flow.response.text = f'{res_mod["full_body_replace"]}'
                    flow.response.headers["content-type"] = "application/json"
                else:
                    for r in res_mod.get("body_replace", []):
                        flow.response.headers["content-type"] = "application/json"
                        if flow.response.text:
                            flow.response.text = f'{flow.response.text.replace(r["from"], r["to"])}'

addons = [Interceptor()]
