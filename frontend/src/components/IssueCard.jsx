import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Wrench } from 'lucide-react';

export function IssueCard({ issue, onApplyFix }) {
  const severityConfig = {
    ERROR: {
      bg: "bg-rose-50/90",
      border: "border-l-4 border-l-rose-600 border-rose-200",
      text: "text-rose-900",
      badge: "bg-rose-100 text-rose-800 border border-rose-300 font-bold",
      icon: AlertCircle
    },
    WARNING: {
      bg: "bg-amber-50/90",
      border: "border-l-4 border-l-amber-500 border-amber-200",
      text: "text-amber-900",
      badge: "bg-amber-100 text-amber-800 border border-amber-300 font-bold",
      icon: AlertTriangle
    },
    INFO: {
      bg: "bg-blue-50/90",
      border: "border-l-4 border-l-blue-500 border-blue-200",
      text: "text-blue-900",
      badge: "bg-blue-100 text-blue-800 border border-blue-300 font-bold",
      icon: Info
    }
  };

  const cfg = severityConfig[issue.severity] || severityConfig.INFO;
  const Icon = cfg.icon;

  return (
    <div className={`p-4 rounded-xl ${cfg.bg} ${cfg.border} glass-card-hover mb-3.5 shadow-xs`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          
          {/* Header Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider ${cfg.badge} flex items-center gap-1`}>
              <Icon className="w-3 h-3" />
              {issue.severity}
            </span>

            {issue.carc_code && (
              <span className="px-2.5 py-0.5 text-[11px] font-bold bg-slate-900 text-white rounded-md shadow-2xs">
                CARC Code: <span className="text-amber-300">{issue.carc_code}</span>
              </span>
            )}

            <span className="px-2 py-0.5 text-[10px] font-semibold bg-white text-slate-700 border border-slate-300 rounded-md">
              Rule ID: {issue.rule_id}
            </span>

            {issue.category && (
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-md capitalize">
                Category: {issue.category.replace('_', ' ')}
              </span>
            )}

            {issue.affected_line !== undefined && issue.affected_line !== null && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-200 text-slate-800 rounded-md">
                Line #{issue.affected_line + 1}
              </span>
            )}
          </div>

          {/* Issue Description */}
          <h4 className={`text-sm font-bold ${cfg.text} mb-1.5 leading-snug`}>
            {issue.description}
          </h4>

          {/* Actionable Fix Recommendation */}
          {issue.fix_recommendation && (
            <div className="mt-2.5 p-3 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs">
              <div className="flex items-center gap-1.5 font-extrabold text-emerald-700 mb-1">
                <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recommended Action Plan:</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-5 font-medium">
                {issue.fix_recommendation}
              </p>
            </div>
          )}

        </div>

        {/* Quick Fix Button */}
        {onApplyFix && issue.carc_code === "197" && (
          <button
            onClick={() => onApplyFix(issue)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-sm shrink-0"
          >
            <CheckCircle className="w-3.5 h-3.5 text-white" />
            <span>Apply Fix</span>
          </button>
        )}
      </div>
    </div>
  );
}
