from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class ClaimLine(BaseModel):
    cpt_code: str
    icd10_codes: List[str]
    units: int = 1
    charge_amount: float
    place_of_service: str
    modifier: Optional[str] = None

class Claim(BaseModel):
    claim_id: str
    patient_id: str
    patient_dob: date
    payer_name: str
    rendering_provider_npi: str
    service_date: date
    submission_date: date
    prior_auth_number: Optional[str] = None
    lines: List[ClaimLine]

class ValidationIssue(BaseModel):
    rule_id: str
    carc_code: str
    severity: str
    category: str
    description: str
    fix_recommendation: str
    affected_line: Optional[int] = None

class ValidationResult(BaseModel):
    claim_id: str
    risk_score: int
    approval_probability: float
    issues: List[ValidationIssue]
    errors_count: int
    warnings_count: int
    is_ready_to_submit: bool