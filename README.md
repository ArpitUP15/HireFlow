<div align="center">

# HireFlow

### A clearer way to move from job opening to great hire.

An AI-assisted recruitment and HR workspace for hiring teams—and a dedicated job-search portal for candidates.

**Post jobs · Review applications · Coordinate interviews · Keep every hiring decision in one place**

</div>

---

## 📚 Contents

- [What is HireFlow?](#-what-is-hireflow)
- [Features](#-features)
- [Technology](#-technology)
- [Repository layout](#-repository-layout)
- [Prerequisites](#-prerequisites)
- [Run locally](#️-run-locally)
- [Authentication and password rules](#-authentication-and-password-rules)
- [Main application routes](#-main-application-routes)
- [Development and tests](#-development-and-tests)
- [Security and configuration notes](#️-security-and-configuration-notes)
- [License](#-license)

<a id="what-is-hireflow"></a>
## ✨ What is HireFlow?

HireFlow is a full-stack recruitment platform with two connected experiences:

- **For hiring teams:** manage organizations, jobs, candidate records, applications, interviews, and hiring pipelines.
- **For candidates:** build a profile, upload a resume, explore published roles, apply, and follow application progress.

Optional AI tools assist recruiters with resume parsing, candidate screening, job matching, and interview-question generation. AI output is intended to support—not replace—human review.

<a id="features"></a>
## 🚀 Features

### Hiring team workspace

- Organization setup, settings, memberships, invitations, and permission-aware access.
- Job creation and publishing, with employment type, location, experience, skills, and compensation details.
- Candidate profiles, resume management, search, and recruitment pipeline tools.
- Application review with status tracking, recruiter notes, ratings, and candidate/job details.
- Interview scheduling and structured interview feedback.
- Notifications, analytics, and organization activity metrics.

### Candidate portal

- Candidate registration and secure sign-in.
- Editable profile and professional details.
- Private PDF resume upload and download.
- Search and filter published jobs.
- Job applications with an optional cover letter.
- Application history, status counts, and status timeline.

### AI-assisted recruitment

When a Groq API key is configured, recruiters can use AI to:

- Parse supported resumes and extract useful candidate information.
- Compare a resume against a job description.
- Screen a candidate for a role and summarize evidence.
- Generate role-specific interview questions.
- Review saved AI insight history and organization processing metrics.

<a id="technology"></a>
## 🧰 Technology

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Lucide |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT in an HTTP-only cookie, bcrypt password hashing |
| Live updates | Socket.IO |
| AI | Groq API |
| Documents | PDF and DOCX parsing; protected resume downloads |
| Testing | Jest, Supertest, MongoDB Memory Server; ESLint |

<a id="repository-layout"></a>
## 🗂️ Repository layout

```text
HireFlow/
├── client/                 # React application
│   └── src/
│       ├── components/     # Shared UI and workflow components
│       ├── context/        # Authentication, theme, organization state
│       ├── pages/          # Landing, portal, hiring, and admin pages
│       ├── routes/         # Client-side route guards and route map
│       └── services/       # API and feature service modules
└── server/                 # Express API and Socket.IO server
    ├── src/
    │   ├── config/         # External service configuration
    │   ├── controllers/    # HTTP request handlers
    │   ├── db/             # MongoDB connection
    │   ├── middleware/     # Authentication, permissions, uploads
    │   ├── models/         # Mongoose schemas
    │   ├── routes/         # API route modules
    │   ├── services/       # AI, email, and resume services
    │   └── utils/          # Shared helpers and validation
    └── tests/              # API and integration tests
```

<a id="prerequisites"></a>
## ✅ Prerequisites

- **Node.js 24.x** (the client package currently specifies `>=24.0.0 <25`).
- npm.
- MongoDB, running locally or available through a MongoDB connection URI.
- A Groq API key for AI features (optional for the rest of the app).

<a id="run-locally"></a>
## ⚙️ Run locally

### 1. Get the project and install dependencies

From the project root:

```powershell
cd client
npm ci
cd ..\server
npm ci
cd ..
```

### 2. Configure the backend

Create `server/.env` from the checked-in example:

```powershell
Copy-Item server/.env.example server/.env
```

Edit `server/.env`. At minimum, configure MongoDB and replace the development JWT secret with a long, unique secret:

```dotenv
PORT=5001
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/hireflow
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

To enable AI actions, add a real Groq key:

```dotenv
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
GROQ_TIMEOUT_MS=90000
```

Organization invitations are delivered as in-app notifications to existing HireFlow users. For invitees without an account, share the generated invitation link directly; it expires after 7 days.

### 3. Configure the frontend

The client uses these defaults if no Vite environment file is present:

```dotenv
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

If you change backend ports or hosts, set the corresponding values in `client/.env` and set `CLIENT_URL` in `server/.env` to the frontend origin. Do not put server secrets in client environment variables; Vite variables are included in browser code.

### 4. Start the application

Open two terminals from the project root.

**Terminal 1 — backend**

```powershell
cd server
npm run dev
```

**Terminal 2 — frontend**

```powershell
cd client
npm run dev
```

Open the Vite URL printed in the client terminal (by default, `http://localhost:5173`). The API listens on port `5001` by default.

<a id="authentication-and-password-rules"></a>
## 🔐 Authentication and password rules

New passwords must:

- Be at least **8 characters** long.
- Include an uppercase letter and a lowercase letter.
- Include a number.
- Include a special character.

The registration form and server both enforce these requirements. Passwords are hashed before they are stored; authentication tokens are sent using an HTTP-only cookie.

<a id="main-application-routes"></a>
## 🧭 Main application routes

### Web application

| Route | Purpose |
| --- | --- |
| `/` | Landing page, product overview, FAQ, and contact form |
| `/login` · `/register` | Account access |
| `/dashboard` | Candidate, recruiter, or organization dashboard |
| `/jobs` | Published-job search for candidates; job management for staff |
| `/profile` | Candidate profile and resume |
| `/applications` | Hiring-team application management |
| `/pipeline` | Recruitment pipeline |
| `/interviews` | Interview coordination |
| `/organization` · `/team` | Organization and team workflows |

### API overview

The backend is organized under `/api`:

| Prefix | Purpose |
| --- | --- |
| `/api/auth` | Registration, login, logout, current user |
| `/api/portal` | Candidate profile, resume, jobs, applications |
| `/api/organizations` | Organizations, members, permissions, invitations |
| `/api/jobs` | Hiring-team job management |
| `/api/candidates` | Hiring-team candidate records |
| `/api/applications` | Hiring-team application workflows |
| `/api/interviews` | Interview scheduling and feedback |
| `/api/analytics` | Organization analytics |
| `/api/ai` | Resume parsing, screening, matching, interview questions |
| `/api/notifications` | Notifications and invitation updates |
| `/api/admin` | Administrative operations |
| `/api/public` | Public contact endpoint |
| `/api/stats` | Platform statistics |

Health checks are available at `GET /` and `GET /health`.

Protected API calls use the authentication cookie. Organization-scoped requests may also use the `x-organization-id` header where appropriate.

<a id="development-and-tests"></a>
## 🧪 Development and tests

Run commands from the corresponding package directory.

**Frontend**

```powershell
cd client
npm run lint
npm run build
```

**Backend**

```powershell
cd server
npm test
npm run test:watch
npm run test:coverage
npm run test:ai
```

The API tests use MongoDB Memory Server. The first run may need to download a MongoDB binary. The AI integration suite exercises local parsing and mocked/test flows; live Groq calls require valid credentials and should be treated as external provider usage.

<a id="security-and-configuration-notes"></a>
## 🛡️ Security and configuration notes

- Keep `server/.env` private; never commit API keys, database credentials, SMTP passwords, or production JWT secrets.
- Use HTTPS and a strong, unique `JWT_SECRET` in production.
- Configure `CLIENT_URL` for the exact trusted frontend origin.
- Resume downloads are served through authenticated routes rather than public file links.
- AI processing endpoints require an authorized organization member and are rate-limited.
- Avoid sending real candidate data to external AI providers unless your organization has approved that use.

<a id="license"></a>
## 📄 License

No license is currently specified in this repository. Add a `LICENSE` file before redistributing the project under an open-source license.