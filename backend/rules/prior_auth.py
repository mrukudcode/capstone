import json
import os
from models.claim import Claim, ValidationIssue

# Load prior auth rules from data folder
rules_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "prior_auth_rules.json")
with open(rules_path) as f:
    AUTH_RULES = {r["cpt_code"]: r for r in json.load(f)["rules"]}

def validate_prior_auth(claim: Claim) -> list:
    issues = []

    for i, line in enumerate(claim.lines):
        rule = AUTH_RULES.get(line.cpt_code)
        if not rule:
            continue

        requires_auth = (
            claim.payer_name in rule.get("payers_requiring_auth", []) or
            (claim.payer_name == "Medicare" and rule.get("medicare_required", False)) or
            (claim.payer_name == "Medicaid" and rule.get("medicaid_required", False))
        )

        if requires_auth and not claim.prior_auth_number:
            issues.append(ValidationIssue(
                rule_id="P001",
                carc_code="197",
                severity="ERROR",
                category="prior_auth",
                description=f"CPT {line.cpt_code} requires prior authorization from {claim.payer_name}",
                fix_recommendation=f"Obtain prior auth from {claim.payer_name} before service. Typical lead time: {rule.get('typical_lead_time_days', 5)} business days.",
                affected_line=i
            ))

    return issues