from models.claim import Claim, ValidationIssue

FILING_LIMITS = {
    "Medicare": 365,
    "Medicaid": 365,
    "UnitedHealthcare": 180,
    "Aetna": 180,
    "Cigna": 180,
    "BCBS": 365,
    "default": 180
}

def validate_timely_filing(claim: Claim) -> list:
    issues = []
    limit_days = FILING_LIMITS.get(claim.payer_name, FILING_LIMITS["default"])
    days_since_service = (claim.submission_date - claim.service_date).days

    if days_since_service > limit_days:
        issues.append(ValidationIssue(
            rule_id="T001",
            carc_code="29",
            severity="ERROR",
            category="timely_filing",
            description=f"Claim is {days_since_service} days past service date. {claim.payer_name} limit is {limit_days} days",
            fix_recommendation="Submit timely filing exception with documentation. Check if appeal is possible.",
        ))
    elif days_since_service > (limit_days * 0.8):
        issues.append(ValidationIssue(
            rule_id="T002",
            carc_code="29",
            severity="WARNING",
            category="timely_filing",
            description=f"Claim approaching filing deadline. {limit_days - days_since_service} days remaining",
            fix_recommendation="Submit this claim immediately to avoid timely filing denial.",
        ))

    return issues