import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export function RiskScore({ score = 0, size = 160 }) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  // Color & Label threshold mappings
  const color = normalizedScore <= 30 
    ? "#10b981" // green
    : normalizedScore <= 65 
    ? "#f59e0b" // amber
    : "#ef4444"; // red

  const glowClass = normalizedScore <= 30
    ? "glow-emerald text-emerald-400"
    : normalizedScore <= 65
    ? "glow-amber text-amber-400"
    : "glow-rose text-rose-400";

  const label = normalizedScore <= 30 ? "Low Risk"
    : normalizedScore <= 65 ? "Medium Risk"
    : "High Risk";

  const Icon = normalizedScore <= 30 ? CheckCircle2
    : normalizedScore <= 65 ? AlertTriangle
    : ShieldAlert;

  const approvalProb = Math.max(0, Math.round((1 - normalizedScore / 100) * 100));

  // SVG Gauge dimensions
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        
        {/* Background Subtle Glow Ring */}
        <div 
          className={`absolute inset-2 rounded-full opacity-20 blur-xl transition-all duration-700 ${glowClass}`} 
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Ring Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          {/* Animated Foreground Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease"
            }}
          />
        </svg>

        {/* Center Score & Icon Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span 
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: color }}
          >
            {normalizedScore}
          </span>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
            Risk Score
          </span>
        </div>
      </div>

      {/* Dynamic Status Badge */}
      <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner">
        <Icon className="w-4 h-4" style={{ color: color }} />
        <span className="text-xs font-bold tracking-wide" style={{ color: color }}>
          {label}
        </span>
      </div>

      {/* Approval Probability metric */}
      <div className="mt-2 text-center">
        <span className="text-xs font-medium text-slate-400">
          Estimated Approval: <span className="font-semibold text-slate-200">{approvalProb}%</span>
        </span>
      </div>
    </div>
  );
}
