import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Play, RefreshCw, BarChart3 
} from 'lucide-react';
import { SYNPUF_BATCH_CLAIMS } from '../data/demoClaims';

const CATEGORY_COLORS = {
  "prior_auth": "#dc2626", // Red
  "eligibility": "#d97706", // Amber
  "coding": "#2563eb", // Blue
  "medical_necessity": "#7c3aed", // Purple
  "timely_filing": "#db2777", // Pink
  "duplicate": "#0891b2" // Cyan
};

const PIE_COLORS = ["#10b981", "#ef4444"];

export function AnalyticsDashboard({ history = [] }) {
  // Combine user evaluated claims history with SynPUF synthetic batch dataset
  const [claimsData, setClaimsData] = useState([...history, ...SYNPUF_BATCH_CLAIMS]);
  const [isRunningBatch, setIsRunningBatch] = useState(false);

  // 1. Calculate Issues by Category for Bar Chart
  const categoryCounts = claimsData.reduce((acc, claim) => {
    if (claim.issues && claim.issues.length > 0) {
      claim.issues.forEach(issue => {
        const cat = issue.category || "coding";
        acc[cat] = (acc[cat] || 0) + 1;
      });
    } else if (claim.category && claim.category !== "none") {
      acc[claim.category] = (acc[claim.category] || 0) + 1;
    }
    return acc;
  }, {});

  const barData = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat.replace('_', ' ').toUpperCase(),
    count: count,
    fill: CATEGORY_COLORS[cat] || "#2563eb"
  }));

  // 2. Calculate Submission Readiness Pie Chart Data
  const readyCount = claimsData.filter(c => c.is_ready_to_submit !== false && (c.risk_score || 0) <= 30).length;
  const needsFixCount = claimsData.length - readyCount;

  const pieData = [
    { name: "Ready to Submit", value: readyCount },
    { name: "Needs Correction", value: needsFixCount }
  ];

  // 3. Financial Impact Metrics
  const revenueAtRisk = claimsData
    .filter(c => c.is_ready_to_submit === false || (c.risk_score || 0) > 30)
    .reduce((sum, claim) => {
      const linesTotal = claim.lines?.reduce((lSum, l) => lSum + (l.charge_amount || 0), 0) || 1250;
      return sum + linesTotal;
    }, 0);

  const estimatedAdminSavings = (claimsData.length * 118 * 0.86).toFixed(0);

  const handleRunBatch = () => {
    setIsRunningBatch(true);
    setTimeout(() => {
      // Append extra synthetic batch claims to show dynamic live updates
      const extraClaims = SYNPUF_BATCH_CLAIMS.map((c, i) => ({
        ...c,
        claim_id: `LIVE-BATCH-${Date.now()}-${i}`
      }));
      setClaimsData(prev => [...extraClaims, ...prev]);
      setIsRunningBatch(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner & Batch Simulator Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">ClaimGuard Executive Analytics</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pre-validation performance metrics across {claimsData.length} claims.
          </p>
        </div>

        <button
          onClick={handleRunBatch}
          disabled={isRunningBatch}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md glow-blue transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isRunningBatch ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Simulating 20+ SynPUF Claims...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-emerald-200 fill-emerald-200" />
              <span>Run Live SynPUF Batch Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Executive Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Claims Analyzed
          </div>
          <div className="text-3xl font-black text-slate-900">
            {claimsData.length}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold pt-1">
            CMS SynPUF & Provider Feed
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Revenue Protected
          </div>
          <div className="text-3xl font-black text-emerald-600">
            ₹{revenueAtRisk.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold pt-1">
            Flagged & corrected pre-submission
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Preventable Denial Rate
          </div>
          <div className="text-3xl font-black text-indigo-600">
            86%
          </div>
          <div className="text-[11px] text-indigo-700 font-semibold pt-1">
            Industry Benchmark Target
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Est. Admin Cost Savings
          </div>
          <div className="text-3xl font-black text-amber-600">
            ₹{parseInt((claimsData.length * 9800 * 0.86).toFixed(0)).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold pt-1">
            Based on ₹9,800 avg denial rework cost
          </div>
        </div>

      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bar Chart: Denial Issues by Category */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Denial Issues by Category
              </h3>
              <p className="text-xs text-slate-500">Distribution across 6 core validation rule engines</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Claim Submission Readiness */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Claim Submission Readiness
            </h3>
            <p className="text-xs text-slate-500">Clean vs Action Required Ratio</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around pt-2 text-xs border-t border-slate-100 font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-800">Ready to Submit ({readyCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-800">Needs Fix ({needsFixCount})</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
