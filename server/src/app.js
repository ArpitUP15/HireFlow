import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


// =====================================================
// ROUTES
// =====================================================

import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";


// =====================================================
// MIDDLEWARE
// =====================================================

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorMiddleware.js";


// =====================================================
// APP
// =====================================================

const app =
  express();


// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);


// =====================================================
// BODY PARSERS
// =====================================================

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);


// =====================================================
// COOKIE PARSER
// =====================================================

app.use(
  cookieParser()
);


// =====================================================
// ROOT
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "HireFlow API is running 🚀",
    });
  }
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/health",
  (req, res) => {

    res.status(200).json({
      success: true,
      status: "healthy",
      service:
        "HireFlow API",
      timestamp:
        new Date().toISOString(),
    });
  }
);


// =====================================================
// PUBLIC ROUTES
//
// IMPORTANT:
// These routes are BEFORE protected routes.
// They do NOT require authentication.
// They do NOT require x-organization-id.
// =====================================================

app.use(
  "/api/public",
  publicRoutes
);


// =====================================================
// AUTH ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);


// =====================================================
// ORGANIZATION ROUTES
// =====================================================

app.use(
  "/api/organizations",
  organizationRoutes
);


// =====================================================
// JOB ROUTES
// =====================================================

app.use(
  "/api/jobs",
  jobRoutes
);


// =====================================================
// CANDIDATE ROUTES
// =====================================================

app.use(
  "/api/candidates",
  candidateRoutes
);


// =====================================================
// APPLICATION ROUTES
// =====================================================

app.use(
  "/api/applications",
  applicationRoutes
);


// =====================================================
// INTERVIEW ROUTES — PHASE 6
// =====================================================

app.use(
  "/api/interviews",
  interviewRoutes
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  notFound
);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  errorHandler
);


// =====================================================
// EXPORT
// =====================================================

export default app;