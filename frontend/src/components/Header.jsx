import React from 'react';
import { ShieldCheck, Sparkles, LayoutDashboard, FileText, BarChart3, ChevronDown } from 'lucide-react';
import { HIGH_RISK_CLAIM, FIXED_CLAIM, CLEAN_CLAIM, TIMELY_FILING_CLAIM } from '../data/demoClaims';

export function Header({ activeTab, setActiveTab, backendStatus, onLoadDemoClaim, isAnalyzing }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-md glow-blue">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  ClaimGuard <span className="text-blue-600">AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                AI-Powered Insurance Claim Pre-Validation System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'form'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Submit Claim</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'results'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Validation Results</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Right Action Bar: Demo Presets & Service Pulse */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Presets Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg transition-all duration-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Demo Scenarios</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Clinical Presets
                </div>
                
                <button
                  onClick={() => onLoadDemoClaim(HIGH_RISK_CLAIM)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-rose-50 text-slate-800 flex items-center justify-between group/item transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">1. High-Risk Claim (Red)</span>
                    <span className="text-[10px] text-slate-500">Missing Auth + Pediatric Age Issue</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded">Risk 78</span>
                </button>

                <button
                  onClick={() => onLoadDemoClaim(FIXED_CLAIM)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-emerald-50 text-slate-800 flex items-center justify-between transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">2. Corrected Claim (Fix Demo)</span>
                    <span className="text-[10px] text-slate-500">With Prior Auth # PA-2025</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">Ready</span>
                </button>

                <button
                  onClick={() => onLoadDemoClaim(CLEAN_CLAIM)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">3. Clean Routine Claim</span>
                    <span className="text-[10px] text-slate-500">Medicare Office Visit + X-Ray</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">Risk 0</span>
                </button>

                <button
                  onClick={() => onLoadDemoClaim(TIMELY_FILING_CLAIM)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-amber-50 text-slate-800 flex items-center justify-between transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">4. Timely Filing Claim</span>
                    <span className="text-[10px] text-slate-500">&gt;365 Days Past Deadline</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded">CARC 29</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
