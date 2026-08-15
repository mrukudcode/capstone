import pytest
from datetime import date
from models.claim import Claim, ClaimLine

def make_claim(**kwargs):
    defaults = dict(
        claim_id="TEST001",
        patient_id="P001",
        patient_dob=date(1975, 1, 1),
        payer_name="UnitedHealthcare",
        rendering_provider_npi="1234567890",
        service_date=date(2025, 6, 1),
        submission_date=date(2025, 6, 15),
        lines=[ClaimLine(
            cpt_code="27447",
            icd10_codes=["M1711"],
            units=1,
            charge_amount=15000,
            place_of_service="21"
        )]
    )
    defaults.update(kwargs)
    return Claim(**defaults)

# Prior Auth Tests
def test_prior_auth_missing():
    from rules.prior_auth import validate_prior_auth
    claim = make_claim(prior_auth_number=None)
    issues = validate_prior_auth(claim)
    assert any(i.carc_code == "197" for i in issues)

def test_prior_auth_present():
    from rules.prior_auth import validate_prior_auth
    claim = make_claim(prior_auth_number="AUTH123456")
    issues = validate_prior_auth(claim)
    assert not any(i.carc_code == "197" for i in issues)

# Timely Filing Tests
def test_timely_filing_exceeded():
    from rules.timely_filing import validate_timely_filing
    claim = make_claim(
        service_date=date(2024, 1, 1),
        submission_date=date(2025, 6, 1)
    )
    issues = validate_timely_filing(claim)
    assert any(i.rule_id == "T001" for i in issues)

def test_timely_filing_warning():
    from rules.timely_filing import validate_timely_filing
    claim = make_claim(
        service_date=date(2025, 1, 1),
        submission_date=date(2025, 6, 1)
    )
    issues = validate_timely_filing(claim)
    assert any(i.rule_id == "T002" for i in issues)

def test_timely_filing_ok():
    from rules.timely_filing import validate_timely_filing
    claim = make_claim(
        service_date=date(2025, 6, 1),
        submission_date=date(2025, 6, 15)
    )
    issues = validate_timely_filing(claim)
    assert len(issues) == 0

# Eligibility Tests
def test_pediatric_code_adult_patient():
    from rules.eligibility import validate_eligibility
    claim = make_claim(
        patient_dob=date(1975, 1, 1),
        lines=[ClaimLine(
            cpt_code="99381",
            icd10_codes=["Z0000"],
            units=1,
            charge_amount=100,
            place_of_service="11"
        )]
    )
    issues = validate_eligibility(claim)
    assert any(i.rule_id == "E001" for i in issues)

def test_medicare_only_wrong_payer():
    from rules.eligibility import validate_eligibility
    claim = make_claim(
        payer_name="Aetna",
        lines=[ClaimLine(
            cpt_code="G0438",
            icd10_codes=["Z0000"],
            units=1,
            charge_amount=100,
            place_of_service="11"
        )]
    )
    issues = validate_eligibility(claim)
    assert any(i.rule_id == "E002" for i in issues)

# Duplicate Tests
def test_duplicate_claim():
    from rules.duplicates import validate_duplicates, _seen_claims
    _seen_claims.clear()
    claim1 = make_claim(claim_id="DUP001")
    claim2 = make_claim(claim_id="DUP002")
    validate_duplicates(claim1)
    issues = validate_duplicates(claim2)
    assert any(i.carc_code == "18" for i in issues)