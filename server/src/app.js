import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true
  })
);

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(cookieParser());
if (
  process.env.NODE_ENV ===
  "development"
) {
  app.use(morgan("dev"));
}

// Health check

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "HireFlow API is running",
      timestamp:
        new Date().toISOString()
    });
  }
);

// Authentication

app.use(
  "/api/auth",
  authRoutes
);

// Organizations

app.use(
  "/api/organizations",
  organizationRoutes
);

// 404

app.use(notFound);

// Error handler

app.use(errorHandler);

export default app;