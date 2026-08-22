import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def validate_medical_necessity(icd10_code: str, cpt_code: str,
                               clinical_notes: str, payer: str) -> dict:
    prompt = f"""You are a medical necessity reviewer for insurance claims.

CLAIM TO REVIEW:
- Diagnosis Code: {icd10_code}
- Procedure Code: {cpt_code}
- Payer: {payer}

CLINICAL NOTES:
{clinical_notes if clinical_notes else "No clinical notes provided"}

Based on standard Medicare LCD policies and commercial payer guidelines:
1. Does the diagnosis typically support this procedure?
2. Do the clinical notes document the appropriate indications?
3. Are there any red flags that would trigger medical necessity review?

Respond ONLY in this JSON format with no extra text:
{{
  "necessity_supported": false,
  "confidence": "LOW",
  "supporting_factors": ["factors that support necessity"],
  "risk_factors": ["factors that could trigger denial"],
  "carc_risk": "50",
  "recommendation": "specific action to strengthen necessity documentation"
}}"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.choices[0].message.content.replace("```json", "").replace("```", "").strip()
    return json.loads(text)