# MANAK SAARTHI

**Smart India Hackathon 2026**  
**Problem Statement ID:** 26107  
**Problem Statement Title:** AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers  
**Organization:** Ministry of Consumer Affairs, Food & Public Distribution  
**Department:** Department of Consumer Affairs (DoCA)  
**Category:** Software  
**Theme:** Smart Automation  

---

## 📌 Project Overview

**MANAK SAARTHI** is an AI-powered BIS information and guidance platform designed to help MSMEs, startups, industries, students, and consumers easily navigate Bureau of Indian Standards (BIS) documents, schemes, Indian Standards, QCOs, certification processes, and laboratory information through source-backed, context-aware AI assistance.

> **Note**: Official BIS documents and government portals are the primary authority. The AI assistant acts as an intelligent guide and retrieval engine providing citations and references to official clauses, standards, and gazette notifications.

---

## 📁 Repository Structure

```
MANAK-SAARTHI/
├── frontend/             # Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
│   ├── app/              # Next.js App Router root
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Client utilities and helpers
│   ├── types/            # Frontend TypeScript types
│   └── public/           # Static assets
│
├── backend/              # Node.js, Express.js, TypeScript REST API
│   └── src/
│       ├── config/       # Environment, database, and client configs
│       ├── controllers/  # Route request handlers
│       ├── middleware/   # Security, logging, error, and upload middleware
│       ├── routes/       # API route definitions
│       ├── services/     # Business logic, Gemini AI & RAG retrieval services
│       ├── utils/        # Utility helpers and loggers
│       └── types/        # Backend TypeScript interfaces
│
├── docs/                 # Project documentation and specifications
├── data/                 # Raw/processed BIS references and data storage
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Icons & Animation:** Lucide React, Framer Motion
- **State & Data Fetching:** TanStack Query, Axios
- **Form Handling & Validation:** React Hook Form, Zod
- **Notifications:** Sonner

### Backend
- **Runtime & Server:** Node.js, Express.js, TypeScript
- **Security:** Helmet, CORS, Dotenv, Zod
- **Database & Vector:** PostgreSQL, pgvector
- **AI & Embeddings:** Google Gemini API (`@google/genai`)
- **Document Processing:** PDF extraction (`pdf-parse`), Multer (file uploads)
- **Utilities & Logging:** Pino, Pino Pretty, UUID, bcrypt, jsonwebtoken

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- PostgreSQL with `pgvector` extension installed

### Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env` in the respective backend and frontend directories:
   ```bash
   cp .env.example backend/.env
   ```
   Fill in your PostgreSQL `DATABASE_URL` and `GEMINI_API_KEY`.

3. **Development Mode:**
   ```bash
   # Run frontend (port 3000)
   cd frontend
   npm run dev

   # Run backend (port 5000)
   cd backend
   npm run dev
   ```
