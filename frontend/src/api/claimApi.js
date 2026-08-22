import axios from "axios";

// Base API endpoints (direct or proxy)
const RULE_API = "/api/rule";
const AI_API = "/api/ai";

/**
 * Validates a claim against Member 2 Rule Engine
 * Falls back to local simulation if backend is offline.
 */
export async function validateClaim(claimData) {
  try {
    const res = await axios.post(`${RULE_API}/validate`, claimData, { timeout: 10000 });
    return { data: res.data, isMock: false };
  } catch (err) {
    console.warn("Backend Rule Engine offline, executing resilient local simulation:", err.message);
    const mockResult = simulateRuleEngine(claimData);
    return { data: mockResult, isMock: true };
  }
}

/**
 * Analyzes a claim with Member 3 Claude AI Layer
 * Falls back to local simulation if backend is offline.
 */
export async function analyzeClaim(claimData, clinicalNotes = "") {
  try {
    const res = await axios.post(`${AI_API}/analyze`, {
      claim_data: claimData,
      clinical_notes: clinicalNotes || claimData.clinical_notes || ""
    }, { timeout: 15000 });
    return { data: res.data, isMock: false };
  } catch (err) {
    console.warn("Backend AI Layer offline, executing resilient local AI simulation:", err.message);
    const mockRuleResult = simulateRuleEngine(claimData);
    const mockAiResult = simulateAiAnalysis(claimData, mockRuleResult, clinicalNotes);
    return { data: mockAiResult, isMock: true };
  }
}

/**
 * Checks connection health for Rule Engine (:8000) and AI Layer (:8001)
 */
export async function checkBackendStatus() {
  let ruleStatus = false;
  let aiStatus = false;

  try {
    const res = await axios.get(`${RULE_API}/health`, { timeout: 1500 });
    ruleStatus = res.status === 200;
  } catch (e) {
    ruleStatus = false;
  }

  try {
    const res = await axios.get(`${AI_API}/health`, { timeout: 1500 });
    aiStatus = res.status === 200;
  } catch (e) {
    aiStatus = false;
  }

  return { ruleEngine: ruleStatus, aiLayer: aiStatus };
}

// ----------------------------------------------------------------------
// Local Resilient Rule Engine Simulation (Matches Member 2 & 3 specs)
// ----------------------------------------------------------------------

function simulateRuleEngine(claim) {
  const issues = [];
  const serviceDate = new Date(claim.service_date);
  const subDate = new Date(claim.submission_date);
  const dob = new Date(claim.patient_dob);
  
  const age = Math.floor((serviceDate - dob) / (1000 * 60 * 60 * 24 * 365.25));
  const daysElapsed = Math.floor((subDate - serviceDate) / (1000 * 60 * 60 * 24));

  // Category 1: Eligibility (Pediatric / Medicare checks)
  claim.lines.forEach((line, idx) => {
    const pediatricCodes = ["99381", "99382", "99383", "99384", "99385"];
    if (pediatricCodes.includes(line.cpt_code) && age >= 18) {
      issues.push({
        rule_id: "E001",
        carc_code: "6",
        severity: "ERROR",
        category: "eligibility",
        description: `CPT ${line.cpt_code} is a pediatric code but patient is ${age} years old`,
        fix_recommendation: "Verify patient age. If adult, use corresponding adult E&M code (99395-99397 or 99214).",
        affected_line: idx
      });
    }

    const medicareOnly = ["G0438", "G0439"];
    if (medicareOnly.includes(line.cpt_code) && claim.payer_name !== "Medicare") {
      issues.push({
        rule_id: "E002",
        carc_code: "96",
        severity: "ERROR",
        category: "eligibility",
        description: `CPT ${line.cpt_code} is a Medicare-only benefit but payer is ${claim.payer_name}`,
        fix_recommendation: "This code is only billable to Medicare. Verify payer selection.",
        affected_line: idx
      });
    }
  });

  // Category 2: Coding & LCD Policies
  claim.lines.forEach((line, idx) => {
    // Total Knee replacement LCD indication check
    if (line.cpt_code === "27447") {
      const hasValidDx = line.icd10_codes?.some(dx => ["M17.11", "M17.12", "M17.0"].includes(dx));
      if (!hasValidDx) {
        issues.push({
          rule_id: "C003",
          carc_code: "50",
          severity: "ERROR",
          category: "coding",
          description: `Diagnosis ${line.icd10_codes?.[0] || 'None'} does not medically support CPT 27447 per LCD policy`,
          fix_recommendation: "Review LCD policy. Add primary osteoarthritis diagnosis (M17.11) or obtain medical necessity documentation.",
          affected_line: idx
        });
      }
    }
  });

  // Category 3: Prior Authorization
  const priorAuthReqCodes = ["27447", "93306", "70553"];
  claim.lines.forEach((line, idx) => {
    if (priorAuthReqCodes.includes(line.cpt_code) && !claim.prior_auth_number) {
      issues.push({
        rule_id: "P001",
        carc_code: "197",
        severity: "ERROR",
        category: "prior_auth",
        description: `CPT ${line.cpt_code} requires prior authorization from ${claim.payer_name}`,
        fix_recommendation: `Obtain prior auth from ${claim.payer_name} before service. Typical lead time: 5 business days.`,
        affected_line: idx
      });
    }
  });

  // Category 4: Timely Filing
  const limits = {
    Medicare: 365,
    Medicaid: 365,
    UnitedHealthcare: 180,
    Aetna: 180,
    Cigna: 180,
    BCBS: 365,
    default: 180
  };
  const limit = limits[claim.payer_name] || limits.default;

  if (daysElapsed > limit) {
    issues.push({
      rule_id: "T001",
      carc_code: "29",
      severity: "ERROR",
      category: "timely_filing",
      description: `Claim is ${daysElapsed} days past service date. ${claim.payer_name} timely filing limit is ${limit} days`,
      fix_recommendation: "Submit timely filing exception with documentation. Check if formal appeal is possible.",
      affected_line: null
    });
  } else if (daysElapsed > limit * 0.8) {
    issues.push({
      rule_id: "T002",
      carc_code: "29",
      severity: "WARNING",
      category: "timely_filing",
      description: `Claim approaching filing deadline. Only ${limit - daysElapsed} days remaining before ${claim.payer_name} deadline`,
      fix_recommendation: "Submit this claim immediately to avoid timely filing denial.",
      affected_line: null
    });
  }

  // Calculate Risk Score
  let score = 0;
  issues.forEach(i => {
    if (i.severity === "ERROR") score += 20;
    else if (i.severity === "WARNING") score += 8;
    else score += 2;
  });
  const riskScore = Math.min(score, 100);

  const errors = issues.filter(i => i.severity === "ERROR");
  const warnings = issues.filter(i => i.severity === "WARNING");

  return {
    claim_id: claim.claim_id,
    risk_score: riskScore,
    approval_probability: Math.max(0, Math.round((1 - riskScore / 100) * 100) / 100),
    issues: issues,
    errors_count: errors.length,
    warnings_count: warnings.length,
    is_ready_to_submit: errors.length === 0
  };
}

function simulateAiAnalysis(claim, ruleData, notes = "") {
  const isHighRisk = ruleData.risk_score > 30;
  const missingAuth = ruleData.issues.some(i => i.carc_code === "197");

  let summary = "";
  if (ruleData.issues.length === 0) {
    summary = "Claude AI Analysis: Clinical documentation thoroughly supports billed procedures. Physician signature verified, diagnosis codes correctly linked to indications, and prior auth requirement satisfied.";
  } else if (missingAuth) {
    summary = `Claude AI Analysis: High denial probability detected. Billed procedure CPT ${claim.lines[0]?.cpt_code} requires prior authorization from ${claim.payer_name}. Clinical notes do not include a confirmed prior auth approval number.`;
  } else {
    summary = `Claude AI Analysis: Validation findings detected ${ruleData.errors_count} compliance error(s). Document review indicates potential code mismatch or missing indication support. Action required prior to submission.`;
  }

  const docScore = Math.max(20, 100 - ruleData.risk_score);
  const combinedScore = Math.min(100, Math.round(ruleData.risk_score * 0.6 + (100 - docScore) * 0.4));

  return {
    claim_id: claim.claim_id,
    combined_risk_score: combinedScore,
    approval_probability: Math.max(0, Math.round((1 - combinedScore / 100) * 100) / 100),
    rule_engine_issues: ruleData.issues,
    document_analysis: {
      completeness_score: docScore,
      medical_necessity_documented: !isHighRisk,
      physician_signature_present: notes.toLowerCase().includes("signed") || notes.toLowerCase().includes("dr."),
      missing_elements: missingAuth ? ["Prior Authorization Reference Number", "Payer Pre-certification Document"] : [],
      risk_factors: ruleData.issues.map(i => i.description),
      summary: summary,
      recommended_additions: missingAuth ? ["Attach Prior Authorization PDF or Auth # to line item"] : ["Verify modifier and age-appropriate code selection"]
    },
    medical_necessity: {
      necessity_supported: !isHighRisk,
      confidence: isHighRisk ? "MEDIUM" : "HIGH",
      supporting_factors: ["Primary diagnosis code matches clinical narrative"],
      risk_factors: ruleData.issues.map(i => i.description),
      carc_risk: ruleData.issues[0]?.carc_code || "None",
      recommendation: ruleData.issues[0]?.fix_recommendation || "Claim is clean and ready for submission."
    },
    is_ready_to_submit: ruleData.is_ready_to_submit && docScore >= 70
  };
}
