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
- A Neon PostgreSQL project (local PostgreSQL is not required for authentication)

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
   Copy the templates into the backend and frontend directories:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.local.example frontend/.env.local
   ```
   Set `DATABASE_URL` to the Neon connection string, `JWT_SECRET` to a long random value, and `FRONTEND_URL=http://localhost:3000` in `backend/.env`. Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `frontend/.env.local`. Keep `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY` out of frontend environment files.

3. **Initialize Neon:**
   Open the Neon SQL Editor, paste and run [`backend/src/config/schema.sql`](backend/src/config/schema.sql), then verify the backend connection string is in `backend/.env`. The schema creates the `users` table, normalizes allowed roles to `consumer`, `business`, and `lab`, and enforces unique email addresses.

4. **Development Mode:**
   ```bash
   # Run frontend (port 3000)
   cd frontend
   npm run dev

   # Run backend (port 5000)
   cd backend
   npm run dev
   ```

### Authentication API

- `GET /api/health` checks the server.
- `POST /api/auth/register` creates a bcrypt-hashed user and returns a JWT.
- `POST /api/auth/login` verifies credentials and returns a JWT.
- `GET /api/auth/me` requires `Authorization: Bearer <token>` and returns the current user.

The frontend stores only the JWT: “Remember login on this browser” uses `localStorage`, while an unchecked login uses `sessionStorage`. Session restoration validates the token through `/api/auth/me`; invalid tokens are cleared. The dashboard redirects to `/` when there is no valid authenticated user.

### Manual Authentication Test

1. Start both services and confirm `GET http://localhost:5000/api/health` returns `{ "status": "ok" }`.
2. Open the frontend, choose **Create Account**, select a role, and register with a new email and password of at least 8 characters.
3. Sign out, sign in with the same credentials, refresh the page, and open `/dashboard`.
4. Try the same email again to verify a `409`, use a wrong password to verify a `401`, and call `/api/auth/me` with a missing or altered token to verify a `401`.
