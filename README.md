# ClaimGuard AI — Insurance Claim Pre-Validation System

ClaimGuard AI is an AI-powered pre-validation and revenue protection system designed for hospitals and healthcare providers. It validates medical claims before submission to payers, reducing denial rates and protecting hospital revenue.

## 🚀 Key Features
- **6-Layer Core Rule Engine**: Validates Eligibility, Coding, LCD Policies, Prior Authorization, Timely Filing, and Duplicate detection.
- **Claude AI Clinical Analysis**: Evaluates clinical documentation completeness, physician signature verification, and medical necessity indication alignment.
- **Real-Time Risk Scoring**: Animated risk gauge (0–100) with approval probability metrics.
- **Interactive Issue Resolution**: Displays CARC codes (`CARC 197`, `CARC 50`, `CARC 6`, `CARC 29`), severity badges, and 1-click fix recommendations.
- **Executive Analytics Dashboard**: Interactive Recharts visualizations for denial risk distribution across categories, claim submission readiness, and revenue protected (₹).

## 🛠️ Architecture & Technology Stack
- **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons, Recharts, Canvas Confetti.
- **Backend API**: FastAPI, Python 3, Pydantic, Uvicorn.
- **Database**: PostgreSQL (ICD-10, CPT/HCPCS, CARC/RARC, LCD Policy tables).

## 📦 Getting Started

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
