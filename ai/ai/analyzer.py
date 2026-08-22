import httpx
import json
from ai.document_checker import check_document_completeness
from ai.medical_necessity import validate_medical_necessity

HIGH_RISK_CODES = ["27447", "27130", "93306", "70553", "22612", "63047"]

async def full_claim_analysis(claim_data: dict, clinical_notes: str) -> dict:

    # Step 1: Get rule engine results from Member 2
    try:
        async with httpx.AsyncClient(timeout=30) as http:
            rule_result = await http.post(
                "http://localhost:8000/validate",
                json=claim_data
            )
        rule_data = rule_result.json()
    except Exception as e:
        rule_data = {
            "risk_score": 0,
            "issues": [],
            "errors_count": 0,
            "warnings_count": 0,
            "is_ready_to_submit": False,
            "error": str(e)
        }

    # Step 2: AI document completeness check
    simplified_claim = {
        "primary_icd10": claim_data.get("lines", [{}])[0].get("icd10_codes", ["Unknown"])[0],
        "cpt_code": claim_data.get("lines", [{}])[0].get("cpt_code", "Unknown"),
        "pos": claim_data.get("lines", [{}])[0].get("place_of_service", "Unknown"),
        "payer": claim_data.get("payer_name", "Unknown")
    }
    doc_check = check_document_completeness(simplified_claim, clinical_notes)

    # Step 3: AI medical necessity check for high risk codes only
    necessity_check = None
    primary_cpt = claim_data.get("lines", [{}])[0].get("cpt_code", "")
    primary_icd = claim_data.get("lines", [{}])[0].get("icd10_codes", [""])[0]

    if primary_cpt in HIGH_RISK_CODES:
        necessity_check = validate_medical_necessity(
            primary_icd,
            primary_cpt,
            clinical_notes,
            claim_data.get("payer_name", "Unknown")
        )

    # Step 4: Combined risk score
    rule_score = rule_data.get("risk_score", 0)
    doc_score = 100 - doc_check["completeness_score"]
    combined_score = int((rule_score * 0.6) + (doc_score * 0.4))

    return {
        "claim_id": claim_data.get("claim_id", "UNKNOWN"),
        "combined_risk_score": combined_score,
        "approval_probability": round(1 - (combined_score / 100), 2),
        "rule_engine_issues": rule_data.get("issues", []),
        "document_analysis": doc_check,
        "medical_necessity": necessity_check,
        "is_ready_to_submit": rule_data.get("is_ready_to_submit", False) and doc_check["completeness_score"] > 70,
    }