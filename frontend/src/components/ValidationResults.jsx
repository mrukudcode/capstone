import React, { useState } from 'react';
import { RiskScore } from './RiskScore';
import { IssueCard } from './IssueCard';
import { 
  CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Sparkles, 
  ArrowLeft, Check 
} from 'lucide-react';

export function ValidationResults({ result, aiResult, claim, onBackToEdit, onApplyFix, isMock }) {
  const [filter, setFilter] = useState('ALL'); // ALL, ERROR, WARNING

  if (!result) return null;

  // Combine Rule Engine + AI risk score
  const finalRiskScore = aiResult?.combined_risk_score ?? result.risk_score;
  const issues = result.issues || [];
  const errors = issues.filter(i => i.severity === 'ERROR');
  const warnings = issues.filter(i => i.severity === 'WARNING');
  const filteredIssues = filter === 'ALL' 
    ? issues 
    : issues.filter(i => i.severity === filter);

  const isReady = result.is_ready_to_submit && (aiResult?.document_analysis?.completeness_score ?? 100) >= 70;
  const totalBilled = claim?.lines?.reduce((sum, line) => sum + (line.charge_amount || 0), 0) || 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEdit}
            className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl transition-all border border-slate-200 shadow-xs"
            title="Edit Claim"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Claim Pre-Validation Report</h2>
              {isMock && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded">
                  Simulation Engine
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Claim ID: <span className="font-mono text-slate-900 font-bold">{result.claim_id}</span> • Payer: <span className="text-slate-900 font-semibold">{claim?.payer_name}</span>
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {isReady ? (
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2 font-bold text-xs shadow-sm glow-emerald">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ready for Submission</span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl flex items-center gap-2 font-bold text-xs shadow-sm glow-rose">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Action Required Before Submission</span>
            </div>
          )}
        </div>
      </div>

      {/* Top 4 Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <div className="text-2xl font-black text-slate-900">
            ₹{totalBilled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            Total Claim Value
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <div className="text-2xl font-black text-rose-600">
            {errors.length}
          </div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            Critical Errors
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <div className="text-2xl font-black text-amber-600">
            {warnings.length}
          </div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            Warnings
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
          <div className="text-2xl font-black text-emerald-600">
            {Math.max(0, Math.round((1 - finalRiskScore / 100) * 100))}%
          </div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            Approval Probability
          </div>
        </div>
      </div>

      {/* Main Analysis Grid: Left Risk Gauge + Right Claude AI Intelligence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Risk Gauge */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Composite Denial Risk Meter
          </h3>
          <RiskScore score={finalRiskScore} size={170} />
          
          <div className="w-full mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span>Rule Engine Score (Member 2):</span>
              <span className="font-bold text-slate-900">{result.risk_score}/100</span>
            </div>
            {aiResult?.document_analysis && (
              <div className="flex justify-between">
                <span>Doc Quality Score (Member 3 AI):</span>
                <span className="font-bold text-indigo-700">{aiResult.document_analysis.completeness_score}/100</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Claude AI Executive Narrative Summary */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Claude AI Intelligence Analysis Summary
              </h3>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 font-medium mb-4">
              {aiResult?.document_analysis?.summary || "Rule-based pre-validation checks complete. Review specific CARC issue recommendations below."}
            </p>

            {/* Checklist of AI verifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                {aiResult?.document_analysis?.physician_signature_present ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="text-slate-800">Physician Signature Present</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                {aiResult?.medical_necessity?.necessity_supported !== false ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="text-slate-800">LCD Medical Necessity</span>
              </div>
            </div>
          </div>

          {/* Revenue at risk warning */}
          {!isReady && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-800 font-bold">
              <span>Potential Revenue at Risk:</span>
              <span className="font-black text-sm text-rose-600">
                ₹{totalBilled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Validation Issues Breakdown Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Validation Issues ({issues.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                filter === 'ALL' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setFilter('ERROR')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                filter === 'ERROR' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Errors ({errors.length})
            </button>
            <button
              onClick={() => setFilter('WARNING')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                filter === 'WARNING' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Warnings ({warnings.length})
            </button>
          </div>
        </div>

        {/* List of Issue Cards */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No Compliance Issues Found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This claim passes all 6 rule categories (Eligibility, Coding, LCD Policy, Prior Auth, Timely Filing, and Duplicates). Ready for instant payer submission.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIssues.map((issue, idx) => (
              <IssueCard 
                key={idx} 
                issue={issue} 
                onApplyFix={onApplyFix}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
