// Pre-loaded claim data for Enterprise Clinical Scenarios (Rupees / ₹)

export const HIGH_RISK_CLAIM = {
  claim_id: "CLM-2025-001",
  patient_id: "PT-88219",
  patient_dob: "1975-04-12",
  payer_name: "UnitedHealthcare",
  rendering_provider_npi: "1982736450",
  service_date: "2025-06-10",
  submission_date: "2025-06-15",
  prior_auth_number: "", // Missing -> CARC 197
  lines: [
    {
      cpt_code: "27447", // Total knee replacement (Requires Prior Auth)
      icd10_codes: ["M17.11"],
      units: 1,
      charge_amount: 1250000.0, // ₹12,50,000
      place_of_service: "21", // Inpatient Hospital
      modifier: "RT"
    },
    {
      cpt_code: "99381", // Pediatric E&M (Patient is 50yo -> CARC 6)
      icd10_codes: ["Z00.129"],
      units: 1,
      charge_amount: 18000.0, // ₹18,000
      place_of_service: "11", // Office
      modifier: null
    }
  ],
  clinical_notes: "Patient presents with severe right knee osteoarthritis. Pain refractory to physical therapy and corticosteroid injections. Total knee arthroplasty recommended. Note: Prior authorization request submitted verbally but auth reference number not attached to record."
};

export const FIXED_CLAIM = {
  ...HIGH_RISK_CLAIM,
  claim_id: "CLM-2025-001-FIXED",
  prior_auth_number: "PA-UHC-2025-99812", // Fixed!
  lines: [
    {
      cpt_code: "27447",
      icd10_codes: ["M17.11"],
      units: 1,
      charge_amount: 1250000.0,
      place_of_service: "21",
      modifier: "RT"
    },
    {
      cpt_code: "99214", // Fixed from 99381 to Adult E&M 99214!
      icd10_codes: ["M17.11"],
      units: 1,
      charge_amount: 18000.0,
      place_of_service: "11",
      modifier: null
    }
  ],
  clinical_notes: "Patient presents with severe right knee osteoarthritis. Prior Authorization # PA-UHC-2025-99812 verified active through 08/30/2025. Pre-operative clearance complete. Signed by Dr. Sarah Jenkins, MD."
};

export const CLEAN_CLAIM = {
  claim_id: "CLM-2025-002",
  patient_id: "PT-44102",
  patient_dob: "1982-11-04",
  payer_name: "Medicare",
  rendering_provider_npi: "1457896321",
  service_date: "2025-06-01",
  submission_date: "2025-06-04",
  prior_auth_number: "PA-MED-8812",
  lines: [
    {
      cpt_code: "99214",
      icd10_codes: ["I10"],
      units: 1,
      charge_amount: 15000.0, // ₹15,000
      place_of_service: "11",
      modifier: null
    },
    {
      cpt_code: "71046",
      icd10_codes: ["R05.9"],
      units: 1,
      charge_amount: 11500.0, // ₹11,500
      place_of_service: "11",
      modifier: null
    }
  ],
  clinical_notes: "Routine follow up for essential hypertension and acute cough. Chest X-Ray 2 views performed showing clear lungs. Signed by Dr. Robert Chen, MD."
};

export const TIMELY_FILING_CLAIM = {
  claim_id: "CLM-2025-003",
  patient_id: "PT-99012",
  patient_dob: "1960-02-18",
  payer_name: "Aetna",
  rendering_provider_npi: "1122334455",
  service_date: "2024-01-10", // > 180 days -> Timely Filing Violation CARC 29
  submission_date: "2025-06-15",
  prior_auth_number: "PA-AET-5510",
  lines: [
    {
      cpt_code: "93306", // Echocardiography
      icd10_codes: ["I50.9"],
      units: 1,
      charge_amount: 100000.0, // ₹1,00,000
      place_of_service: "11",
      modifier: null
    }
  ],
  clinical_notes: "Complete transthoracic echocardiogram for congestive heart failure evaluation."
};

// 20 Synthetic SynPUF claims for populating batch analytics in ₹ (rupees)
export const SYNPUF_BATCH_CLAIMS = [
  { claim_id: "SYN-001", payer_name: "Medicare", lines: [{ cpt_code: "99213", charge_amount: 10000 }], is_ready_to_submit: true, risk_score: 0, category: "none" },
  { claim_id: "SYN-002", payer_name: "UnitedHealthcare", lines: [{ cpt_code: "27447", charge_amount: 1250000 }], is_ready_to_submit: false, risk_score: 80, category: "prior_auth", carc_code: "197" },
  { claim_id: "SYN-003", payer_name: "Medicare", lines: [{ cpt_code: "G0438", charge_amount: 20000 }], is_ready_to_submit: true, risk_score: 5, category: "none" },
  { claim_id: "SYN-004", payer_name: "Aetna", lines: [{ cpt_code: "93306", charge_amount: 100000 }], is_ready_to_submit: false, risk_score: 90, category: "timely_filing", carc_code: "29" },
  { claim_id: "SYN-005", payer_name: "Cigna", lines: [{ cpt_code: "70553", charge_amount: 170000 }], is_ready_to_submit: false, risk_score: 65, category: "medical_necessity", carc_code: "50" },
  { claim_id: "SYN-006", payer_name: "BCBS", lines: [{ cpt_code: "99214", charge_amount: 15000 }], is_ready_to_submit: true, risk_score: 0, category: "none" },
  { claim_id: "SYN-007", payer_name: "Medicare", lines: [{ cpt_code: "99381", charge_amount: 18000 }], is_ready_to_submit: false, risk_score: 75, category: "eligibility", carc_code: "6" },
  { claim_id: "SYN-008", payer_name: "UnitedHealthcare", lines: [{ cpt_code: "93306", charge_amount: 100000 }], is_ready_to_submit: false, risk_score: 85, category: "prior_auth", carc_code: "197" },
  { claim_id: "SYN-009", payer_name: "Aetna", lines: [{ cpt_code: "99215", charge_amount: 21000 }], is_ready_to_submit: true, risk_score: 10, category: "none" },
  { claim_id: "SYN-10", payer_name: "Cigna", lines: [{ cpt_code: "80053", charge_amount: 7500 }], is_ready_to_submit: true, risk_score: 0, category: "none" },
  { claim_id: "SYN-011", payer_name: "Medicare", lines: [{ cpt_code: "99214", charge_amount: 15000 }], is_ready_to_submit: false, risk_score: 60, category: "coding", carc_code: "4" },
  { claim_id: "SYN-012", payer_name: "BCBS", lines: [{ cpt_code: "27447", charge_amount: 1250000 }], is_ready_to_submit: true, risk_score: 0, category: "none" },
  { claim_id: "SYN-013", payer_name: "UnitedHealthcare", lines: [{ cpt_code: "70553", charge_amount: 170000 }], is_ready_to_submit: false, risk_score: 70, category: "documentation", carc_code: "16" },
  { claim_id: "SYN-014", payer_name: "Medicare", lines: [{ cpt_code: "99213", charge_amount: 10000 }], is_ready_to_submit: true, risk_score: 0, category: "none" },
  { claim_id: "SYN-015", payer_name: "Aetna", lines: [{ cpt_code: "99214", charge_amount: 15000 }], is_ready_to_submit: true, risk_score: 5, category: "none" },
  { claim_id: "SYN-016", payer_name: "Cigna", lines: [{ cpt_code: "99385", charge_amount: 18500 }], is_ready_to_submit: false, risk_score: 80, category: "eligibility", carc_code: "6" },
  { claim_id: "SYN-017", payer_name: "BCBS", lines: [{ cpt_code: "93306", charge_amount: 100000 }], is_ready_to_submit: true, risk_score: 0, category: "none" },
  { claim_id: "SYN-018", payer_name: "UnitedHealthcare", lines: [{ cpt_code: "99214", charge_amount: 15000 }], is_ready_to_submit: false, risk_score: 55, category: "duplicate", carc_code: "18" },
  { claim_id: "SYN-019", payer_name: "Medicare", lines: [{ cpt_code: "80053", charge_amount: 7500 }], is_ready_to_submit: true, risk_score: 0, category: "none" },
  { claim_id: "SYN-020", payer_name: "Aetna", lines: [{ cpt_code: "27447", charge_amount: 1250000 }], is_ready_to_submit: false, risk_score: 85, category: "prior_auth", carc_code: "197" }
];
