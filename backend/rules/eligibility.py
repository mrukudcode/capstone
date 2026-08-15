from models.claim import Claim, ValidationIssue

def validate_eligibility(claim: Claim) -> list:
    issues = []
    age = (claim.service_date - claim.patient_dob).days // 365

    for i, line in enumerate(claim.lines):
        # Rule E001: Pediatric codes used for adults
        pediatric_codes = ["99381", "99382", "99383", "99384", "99385"]
        if line.cpt_code in pediatric_codes and age >= 18:
            issues.append(ValidationIssue(
                rule_id="E001",
                carc_code="6",
                severity="ERROR",
                category="eligibility",
                description=f"CPT {line.cpt_code} is a pediatric code but patient is {age} years old",
                fix_recommendation="Verify patient age. If adult, use adult E&M code (99395-99397)",
                affected_line=i
            ))

        # Rule E002: Medicare-only codes billed to other payers
        medicare_only = ["G0438", "G0439"]
        if line.cpt_code in medicare_only and claim.payer_name != "Medicare":
            issues.append(ValidationIssue(
                rule_id="E002",
                carc_code="96",
                severity="ERROR",
                category="eligibility",
                description=f"CPT {line.cpt_code} is a Medicare-only benefit",
                fix_recommendation="This code is only billable to Medicare. Verify payer selection.",
                affected_line=i
            ))

    return issues