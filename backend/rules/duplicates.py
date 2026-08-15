from models.claim import Claim, ValidationIssue

# In-memory store for seen claims (resets on server restart)
_seen_claims = {}

def validate_duplicates(claim: Claim) -> list:
    issues = []

    for i, line in enumerate(claim.lines):
        key = f"{claim.patient_id}_{line.cpt_code}_{claim.service_date}"

        if key in _seen_claims:
            issues.append(ValidationIssue(
                rule_id="D001",
                carc_code="18",
                severity="ERROR",
                category="duplicate",
                description=f"Possible duplicate: CPT {line.cpt_code} already submitted for patient {claim.patient_id} on {claim.service_date}",
                fix_recommendation="Verify this is not a duplicate submission. If rebilling, attach original claim number.",
                affected_line=i
            ))
        else:
            _seen_claims[key] = claim.claim_id

    return issues