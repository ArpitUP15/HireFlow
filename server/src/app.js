import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();


// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-organization-id",
    ],
  })
);


// =====================================================
// BODY PARSERS
// =====================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// =====================================================
// COOKIE PARSER
// =====================================================

app.use(cookieParser());


// =====================================================
// HEALTH CHECK
// =====================================================

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
    timestamp: new Date().toISOString(),
  });
});


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

app.use(
  "/api/interviews",
  interviewRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Server Error:",
      error.message
    );

    const statusCode =
      res.statusCode &&
      res.statusCode !== 200
        ? res.statusCode
        : 500;

    res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
);


export default app;