import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def check_document_completeness(claim_data: dict, clinical_notes: str) -> dict:
    prompt = f"""You are a medical billing compliance expert reviewing a claim before submission.

CLAIM INFORMATION:
- Primary Diagnosis: {claim_data.get("primary_icd10", "Not provided")}
- Procedure Billed: {claim_data.get("cpt_code", "Not provided")}
- Place of Service: {claim_data.get("pos", "Not provided")}
- Payer: {claim_data.get("payer", "Not provided")}

CLINICAL DOCUMENTATION PROVIDED:
{clinical_notes if clinical_notes else "No clinical notes provided"}

Analyze whether this documentation adequately supports the claim.
Check for:
1. Medical necessity clearly documented
2. Physician signature present
3. Date of service matches
4. Clinical findings support the diagnosis
5. Any missing elements that payers typically require

Respond ONLY in this JSON format with no extra text:
{{
  "completeness_score": 0,
  "medical_necessity_documented": false,
  "physician_signature_present": false,
  "missing_elements": ["list of missing items"],
  "risk_factors": ["list of denial risk factors"],
  "summary": "2-3 sentence plain English summary",
  "recommended_additions": ["list of what to add"]
}}"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.choices[0].message.content
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)