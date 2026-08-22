# ClaimGuard AI — How to Run

## Requirements
- PostgreSQL 18 running
- Python 3.10+
- Node.js 18+

## Start the System (3 terminals needed)

### Terminal 1 — Rule Engine
```bash
cd C:\capstone\backend
venv\Scripts\activate.bat
uvicorn main:app --port 8000
```

### Terminal 2 — AI Layer
```bash
cd C:\capstone\ai
venv\Scripts\activate.bat
uvicorn main:app --port 8001
```

### Terminal 3 — Frontend
```bash
cd C:\capstone\frontend
npm run dev
```

## Open in Browser
http://localhost:3000
