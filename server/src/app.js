import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ==========================================
// BODY PARSERS
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// COOKIE PARSER
// ==========================================

app.use(cookieParser());

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HireFlow API is running 🚀",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use(
  "/api/organizations",
  organizationRoutes
);

app.use("/api/jobs", jobRoutes);

app.use(
  "/api/candidates",
  candidateRoutes
);

app.use(
  "/api/applications",
  applicationRoutes
);

// ==========================================
// 404
// ==========================================

app.use(notFound);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorHandler);

export default app;