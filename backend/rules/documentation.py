from models.claim import Claim, ValidationIssue

# CPT codes that require detailed documentation
HIGH_DOC_CODES = {
    "99213": "Office visit requires documented history, exam, and medical decision making",
    "99214": "Office visit requires detailed documented history, exam, and moderate complexity MDM",
    "99215": "Office visit requires comprehensive documentation and high complexity MDM",
    "27447": "Total knee replacement requires X-rays, conservative treatment failure documentation",
    "93306": "Echo requires documented cardiac indication",
    "70553": "Brain MRI requires documented neurological indication",
}

def validate_documentation(claim: Claim) -> list:
    issues = []

    for i, line in enumerate(claim.lines):
        if line.cpt_code in HIGH_DOC_CODES:
            # Flag if no ICD-10 codes provided
            if not line.icd10_codes or len(line.icd10_codes) == 0:
                issues.append(ValidationIssue(
                    rule_id="DOC001",
                    carc_code="16",
                    severity="ERROR",
                    category="documentation",
                    description=f"CPT {line.cpt_code} requires supporting diagnosis codes",
                    fix_recommendation=f"Add ICD-10 diagnosis codes. {HIGH_DOC_CODES[line.cpt_code]}",
                    affected_line=i
                ))
            else:
                issues.append(ValidationIssue(
                    rule_id="DOC002",
                    carc_code="151",
                    severity="WARNING",
                    category="documentation",
                    description=f"CPT {line.cpt_code} is high-documentation risk",
                    fix_recommendation=f"Ensure clinical notes are complete. {HIGH_DOC_CODES[line.cpt_code]}",
                    affected_line=i
                ))

    return issues