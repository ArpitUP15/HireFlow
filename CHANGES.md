# Update contents

Implemented the four Groq recruitment actions, embedded workflow controls, saved AI insights and audit metadata, organization processing metrics, landing text/scroll animations and authenticated REST-polled counters. Real keys are left blank in server/.env.

Verified: 15 integration tests pass; frontend lint and production build pass; desktop/mobile browser checks pass with mocked auth/statistics responses. No live provider calls or live database checks were performed. See SETUP_GROQ.md for setup and operational limits.

## Files added or changed from the supplied ZIP

- `README.md`
- `SETUP_GROQ.md`
- `client/.env`
- `client/src/components/application/AIEvaluationCard.jsx`
- `client/src/components/candidates/RecruitmentAI.jsx`
- `client/src/components/candidates/ResumeUpload.jsx`
- `client/src/components/common/AIProcessingMetrics.jsx`
- `client/src/components/common/LiveHiringStats.jsx`
- `client/src/components/interviews/AIInterviewQuestions.jsx`
- `client/src/index.css`
- `client/src/pages/DashBoard.jsx`
- `client/src/pages/Home.jsx`
- `client/src/pages/applications/ApplicationDetails.jsx`
- `client/src/pages/candidates/CandidateDetails.jsx`
- `client/src/pages/interviews/InterviewAssistant.jsx`
- `client/src/pages/jobs/JobDetails.jsx`
- `client/src/pages/pipeline/Pipeline.jsx`
- `client/src/services/hireflowAI.js`
- `server/.env`
- `server/.env.example`
- `server/.env.test`
- `server/package-lock.json`
- `server/package.json`
- `server/src/app.js`
- `server/src/config/groq.js`
- `server/src/controllers/aiController.js`
- `server/src/controllers/candidateController.js`
- `server/src/middleware/aiUpload.js`
- `server/src/middleware/uploadMiddleware.js`
- `server/src/models/AIInsight.js`
- `server/src/models/Candidate.js`
- `server/src/routes/aiRoutes.js`
- `server/src/routes/publicRoutes.js`
- `server/src/routes/statsRoutes.js`
- `server/src/services/aiService.js`
- `server/src/services/groqService.js`
- `server/src/services/resumeParser.js`
- `server/src/services/resumeService.js`
- `server/src/utils/aiSchemas.js`
- `server/tests/ai-integration.node.js`
- `server/tests/fixtures/resume.docx`
- `server/tests/fixtures/resume.pdf`

Dependency directories, generated build/coverage output, editor settings and Git history are excluded. Reinstall with npm ci in each folder.
