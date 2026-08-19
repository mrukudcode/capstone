import React, { useState } from 'react';
import { 
  Plus, Trash2, Sparkles, User, FileText, Stethoscope, ArrowRight, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { HIGH_RISK_CLAIM, FIXED_CLAIM, CLEAN_CLAIM } from '../data/demoClaims';

export function ClaimForm({ initialClaim, onSubmit, isAnalyzing }) {
  const [claim, setClaim] = useState(initialClaim || HIGH_RISK_CLAIM);

  const handleHeaderChange = (field, value) => {
    setClaim(prev => ({ ...prev, [field]: value }));
  };

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...claim.lines];
    if (field === 'icd10_codes') {
      updatedLines[index][field] = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      updatedLines[index][field] = value;
    }
    setClaim(prev => ({ ...prev, lines: updatedLines }));
  };

  const addLineItem = () => {
    setClaim(prev => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          cpt_code: "99214",
          icd10_codes: ["I10"],
          units: 1,
          charge_amount: 150.0,
          place_of_service: "11",
          modifier: null
        }
      ]
    }));
  };

  const removeLineItem = (index) => {
    if (claim.lines.length <= 1) return;
    setClaim(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const handleLoadPreset = (preset) => {
    setClaim(preset);
    onSubmit(preset);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(claim);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner & Quick Presets */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Insurance Claim Entry</h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              CMS-1500 / 837P Form
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fill in claim details or load a pre-configured clinical scenario below.
          </p>
        </div>

        {/* Quick Demo Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleLoadPreset(HIGH_RISK_CLAIM)}
            className="flex-1 md:flex-none px-3 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>High Risk (3 Issues)</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadPreset(FIXED_CLAIM)}
            className="flex-1 md:flex-none px-3 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Corrected Claim</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadPreset(CLEAN_CLAIM)}
            className="flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-all text-center"
          >
            <span>Clean Routine</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Patient & Provider Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Patient & Provider Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Claim ID</label>
              <input
                type="text"
                value={claim.claim_id}
                onChange={(e) => handleHeaderChange('claim_id', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient ID</label>
              <input
                type="text"
                value={claim.patient_id}
                onChange={(e) => handleHeaderChange('patient_id', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Date of Birth</label>
              <input
                type="date"
                value={claim.patient_dob}
                onChange={(e) => handleHeaderChange('patient_dob', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payer Name</label>
              <select
                value={claim.payer_name}
                onChange={(e) => handleHeaderChange('payer_name', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
              >
                <option value="Medicare">Medicare</option>
                <option value="UnitedHealthcare">UnitedHealthcare</option>
                <option value="Aetna">Aetna</option>
                <option value="Cigna">Cigna</option>
                <option value="BCBS">Blue Cross Blue Shield (BCBS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rendering Provider NPI</label>
              <input
                type="text"
                value={claim.rendering_provider_npi}
                onChange={(e) => handleHeaderChange('rendering_provider_npi', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Service</label>
              <input
                type="date"
                value={claim.service_date}
                onChange={(e) => handleHeaderChange('service_date', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Date</label>
              <input
                type="date"
                value={claim.submission_date}
                onChange={(e) => handleHeaderChange('submission_date', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Prior Auth #</span>
                <span className="text-[10px] text-amber-600 font-bold">CARC 197 Check</span>
              </label>
              <input
                type="text"
                placeholder="e.g. PA-UHC-2025-99812"
                value={claim.prior_auth_number || ''}
                onChange={(e) => handleHeaderChange('prior_auth_number', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Claim Line Items */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Billed Procedures & Diagnosis Line Items
              </h3>
            </div>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Line Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {claim.lines.map((line, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center gap-3 relative group"
              >
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div className="flex-1 md:w-32">
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">CPT Code</label>
                    <input
                      type="text"
                      value={line.cpt_code}
                      onChange={(e) => handleLineChange(idx, 'cpt_code', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div className="w-full md:flex-1">
                  <label className="block text-[10px] text-slate-600 font-bold mb-0.5">ICD-10 Diagnosis Codes (comma separated)</label>
                  <input
                    type="text"
                    value={line.icd10_codes?.join(', ') || ''}
                    onChange={(e) => handleLineChange(idx, 'icd10_codes', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 w-full md:w-64">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Charge (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={line.charge_amount}
                      onChange={(e) => handleLineChange(idx, 'charge_amount', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">POS</label>
                    <input
                      type="text"
                      value={line.place_of_service}
                      onChange={(e) => handleLineChange(idx, 'place_of_service', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-0.5">Modifier</label>
                    <input
                      type="text"
                      placeholder="e.g. RT"
                      value={line.modifier || ''}
                      onChange={(e) => handleLineChange(idx, 'modifier', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 uppercase"
                    />
                  </div>
                </div>

                {claim.lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Remove line item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Clinical Notes (For Member 4 AI Analysis) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Clinical Notes & Attachments (AI Necessity Review)
              </h3>
            </div>
            <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold border border-indigo-200">
              Evaluated by Claude 3.5 Sonnet
            </span>
          </div>

          <textarea
            rows={4}
            value={claim.clinical_notes || ''}
            onChange={(e) => handleHeaderChange('clinical_notes', e.target.value)}
            placeholder="Paste clinical documentation, operative reports, or physician notes here..."
            className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed placeholder:text-slate-400"
          />
        </div>

        {/* Submit Validation Button */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md glow-blue transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Rule Engine & Claude AI Pre-Validation...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Pre-Validate Claim & Calculate Risk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
