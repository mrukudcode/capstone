from models.claim import Claim, ValidationIssue
from db.connection import get_db_cursor

def validate_duplicates(claim: Claim) -> list:
    issues = []

    for i, line in enumerate(claim.lines):
        cur, conn = get_db_cursor()
        key = f"{claim.patient_id}_{line.cpt_code}_{claim.service_date}"

        cur.execute("SELECT claim_id FROM submitted_claims WHERE claim_key = %s", (key,))
        existing = cur.fetchone()

        if existing:
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
            cur.execute(
                "INSERT INTO submitted_claims (claim_key, claim_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (key, claim.claim_id)
            )
            conn.commit()

        conn.close()

    return issues