import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { ClaimForm } from './components/ClaimForm';
import { ValidationResults } from './components/ValidationResults';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { validateClaim, analyzeClaim, checkBackendStatus } from './api/claimApi';
import { HIGH_RISK_CLAIM } from './data/demoClaims';

export function App() {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'results' | 'analytics'
  const [currentClaim, setCurrentClaim] = useState(HIGH_RISK_CLAIM);
  const [validationResult, setValidationResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ ruleEngine: false, aiLayer: false });
  const [history, setHistory] = useState([]);

  // Check backend server availability on mount
  useEffect(() => {
    async function checkStatus() {
      const status = await checkBackendStatus();
      setBackendStatus(status);
    }
    checkStatus();
  }, []);

  // Handle claim validation submission
  const handleValidateClaim = async (claimData) => {
    setIsAnalyzing(true);
    setCurrentClaim(claimData);

    // Call Member 2 Rule Engine
    const ruleRes = await validateClaim(claimData);
    
    // Call Member 3 AI Layer
    const aiRes = await analyzeClaim(claimData, claimData.clinical_notes);

    setValidationResult(ruleRes.data);
    setAiResult(aiRes.data);
    setIsMock(ruleRes.isMock || aiRes.isMock);

    // Trigger celebratory confetti if claim is 100% clean / ready to submit!
    if (ruleRes.data?.is_ready_to_submit) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Save evaluated claim to analytics history
    setHistory(prev => [
      {
        ...ruleRes.data,
        payer_name: claimData.payer_name,
        lines: claimData.lines,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);

    setIsAnalyzing(false);
    setActiveTab('results');
  };

  // Quick preset claim loader from header dropdown or form buttons
  const handleLoadDemoClaim = (demoClaim) => {
    setCurrentClaim(demoClaim);
    handleValidateClaim(demoClaim);
  };

  // Interactive 1-click fix handler (e.g., adding Prior Auth # to fix CARC 197)
  const handleApplyFix = (issue) => {
    if (issue.carc_code === "197") {
      const updatedClaim = {
        ...currentClaim,
        prior_auth_number: "PA-UHC-2025-99812",
        lines: currentClaim.lines.map(line => 
          line.cpt_code === "99381" ? { ...line, cpt_code: "99214" } : line
        )
      };
      setCurrentClaim(updatedClaim);
      handleValidateClaim(updatedClaim);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Fixed Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendStatus={backendStatus}
        onLoadDemoClaim={handleLoadDemoClaim}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Body View Switching */}
      <main className="flex-1 pb-16">
        {activeTab === 'form' && (
          <ClaimForm 
            initialClaim={currentClaim} 
            onSubmit={handleValidateClaim} 
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'results' && (
          <ValidationResults 
            result={validationResult} 
            aiResult={aiResult}
            claim={currentClaim}
            onBackToEdit={() => setActiveTab('form')}
            onApplyFix={handleApplyFix}
            isMock={isMock}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            history={history}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ClaimGuard AI • Hospital Claim Pre-Validation & Revenue Protection System</span>
          <span className="text-slate-500 font-medium">Automated Rule Engine & Clinical AI Analyzer</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
