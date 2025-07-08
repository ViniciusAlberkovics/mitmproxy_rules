import logging
import os
from ruamel.yaml import YAML
from typing import List

yaml = YAML(typ="safe", pure=True)

_last_rules_file_mtime = None

def load_rules(rules_file_path: str) -> List[dict]:
    global _last_rules_file_mtime
    try:
        with open(rules_file_path, "r") as f:
            rules = yaml.load(f).get("rules", [])
        _last_rules_file_mtime = os.path.getmtime(rules_file_path)
        return rules
    except Exception as e:
        logging.error(f"Failed to load rules from {rules_file_path}. File not found or invalid format. {e}")
        return []

def save_rules(rules_file_path: str, rules: List[dict]):
    global _last_rules_file_mtime
    with open(rules_file_path, "w") as f:
        yaml.dump({"rules": rules}, f)
    _last_rules_file_mtime = os.path.getmtime(rules_file_path)

def rules_file_modified_since_last_load(rules_file_path: str) -> bool:
    global _last_rules_file_mtime
    try:
        current_mtime = os.path.getmtime(rules_file_path)
        if _last_rules_file_mtime is None:
            return True
        return current_mtime != _last_rules_file_mtime
    except Exception:
        return True
