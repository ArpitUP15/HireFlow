import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import applicationRoutes from "./routes/applicationRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";

const app = express();


// ================================
// MIDDLEWARE
// ================================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

app.use(cookieParser());


// ================================
// HEALTH CHECK
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 HireFlow API is running",
  });
});


// ================================
// API ROUTES
// ================================

// Phase 2
app.use(
  "/api/auth",
  authRoutes
);

// Phase 3
app.use(
  "/api/organizations",
  organizationRoutes
);

// Phase 4
app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/candidates",
  candidateRoutes
);

app.use("/api/invitations", invitationRoutes);

app.use(
  "/api/applications",
  applicationRoutes
);

// ================================
// 404 HANDLER
// ================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});


// ================================
// ERROR HANDLER
// ================================

app.use(
  (error, req, res, next) => {
    console.error(error);
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
);


export default app;