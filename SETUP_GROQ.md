# HireFlow: Groq integration and live landing page

## Start locally (Windows PowerShell)

Use Node.js 24 LTS, which matches this project's existing client engine requirement. Start a local MongoDB instance or use your MongoDB Atlas connection string.

1. Extract this ZIP. Dependencies and Git history are intentionally excluded; source files and lockfiles are included.
2. Open `server/.env`. It is already included, with no real credentials. Set:

```dotenv
GROQ_API_KEY=your_real_groq_key_here
GROQ_MODEL=openai/gpt-oss-20b
GROQ_TIMEOUT_MS=90000
MONGO_URI=mongodb://127.0.0.1:27017/hireflow
JWT_SECRET=replace_with_your_own_long_random_secret
CLIENT_URL=http://localhost:5173
PORT=5001
```

Create your key at https://console.groq.com/keys. Paste the actual `gsk_...` key after `GROQ_API_KEY=` and restart the backend. Do not put it in a Vite variable or frontend code. The project starts without a Groq key; AI requests return an actionable 503 until configured. SMTP settings are optional for local AI testing but required for actual invitation emails.

3. Start the backend in one terminal:

```powershell
cd HireFlow/server
npm ci
npm run dev
```

4. Start the frontend in a second terminal:

```powershell
cd HireFlow/client
npm ci
npm run dev
```

Open http://localhost:5173. The Vite proxy forwards `/api` to port 5001. `client/.env` uses `VITE_API_URL=/api`. Use the same hostname consistently for cookies. Configure `CLIENT_URL` to the exact frontend origin in production.

## Recruitment workflow

- Sign in as a recruiter or organization owner/admin and create or join an organization. Organization roles allowed for AI: owner, hr_admin, recruiter; candidates and interviewers are denied.
- Open a candidate or application. The embedded Recruitment AI section lets you select a job, upload a PDF/DOCX, parse and save findings, screen qualifications, match individual JD requirements, and generate interview questions.
- Parsing saves raw extracted text and structured findings to the selected candidate; verify these findings before using them. The existing Resume Upload button remains available for storing the original file for downloads. Parsing alone does not replace that original-file attachment.
- Open a job and select a candidate for the same screening, matching and question workflow.
- Open an interview workspace to generate five questions with evaluation guides. Questions can be edited in the current browser view. Generated originals are retained in AI history; edits to questions are not persisted. The existing scorecard saves independently.
- Pipeline cards link to the application qualification review. The dashboard shows AI success/failure totals for the current organization.
- AI findings are stored in organization-scoped `AIInsight` records with actor, type, model, status and timestamp. History shows up to 30 latest records per candidate/job context. AI never changes pipeline status or makes hiring decisions. Old numeric ranking fields are retained for compatibility; this integration does not populate them.

## Landing animations and totals

Before login, counters animate to fictional values **128 / 640 / 215**, explicitly labeled as demo data. After login the sample values are removed and actual totals are loaded from `GET /api/stats`. The old `/api/public/stats` path now uses that same authenticated implementation.

Live totals are platform-wide, aggregate numbers available to signed-in users, with no candidate or organization record details:

- Organizations created: all currently stored organization records.
- Jobs posted: jobs currently marked `published` or `closed`; drafts are excluded.
- Candidates hired: distinct candidate record IDs with at least one `selected` application. The source project has no separate hired/onboarding status. A person represented by multiple candidate records can be counted multiple times.

These are current database totals, not an immutable historical ledger. Deleting records or reversing a selected status changes the totals. REST refresh happens every 10 seconds while the landing page is active, and immediately on returning to the tab. There is no WebSocket push for this section. Loading and API errors never fall back to fictional numbers for logged-in users.

Hero text and scroll reveals use restrained CSS/IntersectionObserver animations; counters use requestAnimationFrame. Reduced-motion settings disable animations and smooth scrolling.

## REST endpoints

All AI routes require the existing HttpOnly authentication cookie, an active organization membership and one of the allowed organization roles. The client sends `x-organization-id` using the existing Axios interceptor. Explicit invalid/inaccessible organization headers are rejected. Browser mutation requests from an unexpected Origin are rejected. No keys are sent to the client.

| Endpoint | Request |
| --- | --- |
| POST `/api/ai/parse-resume` | multipart `resume` PDF/DOCX, optional `candidateId` |
| POST `/api/ai/screen` | `{candidateId, jobId}` or `{resumeText, jobDescription}` |
| POST `/api/ai/match` | same as screening |
| POST `/api/ai/interview-questions` | same document inputs, plus optional `count` 1–10 and `difficulty` easy/medium/hard |
| POST `/api/ai/screen/:candidateId` | compatibility endpoint, `{jobId}` |
| GET `/api/ai/history?candidate=...&job=...` | saved organization-scoped findings |
| GET `/api/ai/metrics` | organization AI success/failure totals |
| GET `/api/stats` | signed-in platform aggregate totals |

Text inputs are limited to 18,000 characters each. PDF/DOCX uploads are limited to 5 MB, MIME/signature checked, and extracted through the installed pdf-parse v2 API or Mammoth. Scanned PDFs need OCR and are rejected if no readable text is found. `.doc` is not supported. Model output is checked against strict JSON schemas and Zod validators. The integration has a 90-second provider timeout, a 100-second client timeout, ten AI requests per user per minute, no automatic retry of provider 429s, and safe user-facing provider error messages. The limiter is in memory; use shared storage for multiple API instances.

## Verification

```powershell
cd server
npm run test:ai
```

The 15 integration checks use synthetic files and mocked database/provider responses. They exercise anonymous access, RBAC, cross-organization isolation, untrusted origins, malformed inputs, missing keys, upload limits/signatures, real PDF/DOCX extraction, strict response handling, rate limits and aggregate totals. They require neither a MongoDB binary nor a real Groq key.

```powershell
cd ../client
npm run lint
npm run build
```

No paid or live Groq request was made during verification. Real account login, your live database and your provider quota must be verified with your own configuration. The older Jest suites are preserved and are not the basis of the new integration test results.

## Operational limits

Groq's free allocation depends on your account and model; check the console for current limits. The implementation uses the official strict structured-output mode documented at https://console.groq.com/docs/structured-outputs and the API documented at https://console.groq.com/docs/api-reference.

No OCR, antivirus engine, bulk-screening job queue, distributed rate limiter or data-retention automation is bundled. Add those services when your deployment needs them. Signature checks are not malware scanning. Keep resume processing manual and small-batch until you add queue controls for your provider's token quota. Keep the existing custom-domain, privacy/terms and deployment checks before launch. Confirm candidate consent and your Groq processing policy before sending real resume content. Never commit a real `.env`.

Browser verification used mocked REST responses: guest demo counters, authenticated live counters, absence of demo labels after login, mobile overflow at 390px and JavaScript runtime errors were checked. No runtime errors or horizontal overflow were observed.
