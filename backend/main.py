from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.claim import Claim, ValidationResult
from rules.eligibility import validate_eligibility
from rules.coding import validate_coding
from rules.prior_auth import validate_prior_auth
from rules.timely_filing import validate_timely_filing
from rules.duplicates import validate_duplicates
from rules.documentation import validate_documentation

app = FastAPI(title="ClaimGuard Rule Engine", version="1.0.0")

# Allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_risk_score(issues: list) -> int:
    score = 0
    for issue in issues:
        if issue.severity == "ERROR":
            score += 20
        elif issue.severity == "WARNING":
            score += 8
        else:
            score += 2
    return min(score, 100)

@app.post("/validate", response_model=ValidationResult)
async def validate_claim(claim: Claim):
    all_issues = []
    all_issues.extend(validate_eligibility(claim))
    all_issues.extend(validate_coding(claim))
    all_issues.extend(validate_prior_auth(claim))
    all_issues.extend(validate_timely_filing(claim))
    all_issues.extend(validate_duplicates(claim))
    all_issues.extend(validate_documentation(claim))

    risk_score = calculate_risk_score(all_issues)
    errors = [i for i in all_issues if i.severity == "ERROR"]
    warnings = [i for i in all_issues if i.severity == "WARNING"]

    return ValidationResult(
        claim_id=claim.claim_id,
        risk_score=risk_score,
        approval_probability=round(1 - (risk_score / 100), 2),
        issues=all_issues,
        errors_count=len(errors),
        warnings_count=len(warnings),
        is_ready_to_submit=len(errors) == 0
    )

@app.get("/health")
def health():
    return {"status": "ok", "service": "ClaimGuard Rule Engine"}