import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from shared.utils import load_rules, save_rules

RULES_FILE = os.environ.get("RULES_FILE")

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/rules")
def list_rules():
    return load_rules(RULES_FILE)

@app.post("/rules")
def create_rule(rule: dict):
    rules = load_rules(RULES_FILE)
    rules.append(rule)
    save_rules(RULES_FILE, rules)
    return {"status": "ok"}

@app.put("/rules/{index}")
def update_rule(index: int, rule: dict):
    rules = load_rules(RULES_FILE)
    if 0 <= index < len(rules):
        rules[index] = rule
        save_rules(RULES_FILE, rules)
        return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Rule not found")

@app.delete("/rules/{index}")
def delete_rule(index: int):
    rules = load_rules(RULES_FILE)
    if 0 <= index < len(rules):
        rules.pop(index)
        save_rules(RULES_FILE, rules)
        return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Rule not found")
