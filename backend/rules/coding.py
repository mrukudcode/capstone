from models.claim import Claim, ValidationIssue
from db.connection import get_db_cursor

def validate_coding(claim: Claim) -> list:
    issues = []

    for i, line in enumerate(claim.lines):
        cur, conn = get_db_cursor()

        # Rule C001: Validate CPT code exists
        cur.execute("SELECT code FROM cpt_codes WHERE code = %s", (line.cpt_code,))
        if not cur.fetchone():
            issues.append(ValidationIssue(
                rule_id="C001",
                carc_code="4",
                severity="ERROR",
                category="coding",
                description=f"CPT code {line.cpt_code} is not a valid/active code",
                fix_recommendation="Check CMS HCPCS code list. Code may be deleted or require update.",
                affected_line=i
            ))

        # Rule C002: Validate ICD-10 codes exist
        for dx in line.icd10_codes:
            cur.execute("SELECT code FROM icd10_codes WHERE code = %s", (dx,))
            if not cur.fetchone():
                issues.append(ValidationIssue(
                    rule_id="C002",
                    carc_code="4",
                    severity="ERROR",
                    category="coding",
                    description=f"ICD-10 code {dx} is not valid for FY2025",
                    fix_recommendation=f"Verify {dx} in 2025 ICD-10-CM codebook. May need 7th character.",
                    affected_line=i
                ))

        conn.close()

    return issues