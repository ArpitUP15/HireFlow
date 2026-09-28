import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorMiddleware.js";

import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
|--------------------------------------------------------------------------
| Cookie Parser
|--------------------------------------------------------------------------
*/

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HireFlow API is running 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "HireFlow API",
    timestamp:
      new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/public",
  publicRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/organizations",
  organizationRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/candidates",
  candidateRoutes
);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/interviews",
  interviewRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use("/api/admin", adminRoutes);
/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
*/

app.use(notFound);

app.use(errorHandler);

export default app;