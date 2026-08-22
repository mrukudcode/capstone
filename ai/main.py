from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from ai.analyzer import full_claim_analysis
import hashlib
import json

app = FastAPI(title="ClaimGuard AI Layer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory cache
_cache = {}

class AnalyzeRequest(BaseModel):
    claim_data: dict
    clinical_notes: Optional[str] = ""

@app.post("/analyze")
async def analyze_claim(request: AnalyzeRequest):
    # Check cache first
    cache_key = hashlib.md5(
        (json.dumps(request.claim_data, sort_keys=True) + request.clinical_notes).encode()
    ).hexdigest()

    if cache_key in _cache:
        return _cache[cache_key]

    result = await full_claim_analysis(request.claim_data, request.clinical_notes)
    _cache[cache_key] = result
    return result

@app.get("/health")
def health():
    return {"status": "ok", "service": "ClaimGuard AI Layer"}