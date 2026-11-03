
import "dotenv/config";

const normalizeOrigin = (origin) => {
  if (!origin) return "";

  return origin.trim().replace(/\/+$/, "");
};

const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    ...(process.env.ALLOWED_ORIGINS || "").split(","),
    "http://localhost:5173",
  ]
    .map(normalizeOrigin)
    .filter(Boolean),
);

const allowVercelPreviews =
  process.env.ALLOW_VERCEL_PREVIEWS === "true";

// Restrict preview deployments to the HireFlow project
// and the Vercel team suffix shown in your deployment URL.
const vercelPreviewPattern =
  /^https:\/\/hireflow-[a-z0-9-]+-arpits-projects-6caab6aa\.vercel\.app$/i;

export const isAllowedOrigin = (origin) => {
  // Requests without an Origin header, such as server-to-server
  // requests, are not browser CORS requests.
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);

  if (allowedOrigins.has(normalizedOrigin)) {
    return true;
  }

  if (
    allowVercelPreviews &&
    vercelPreviewPattern.test(normalizedOrigin)
  ) {
    return true;
  }

  return false;
};

const originCallback = (origin, callback) => {
  if (isAllowedOrigin(origin)) {
    return callback(null, origin || true);
  }

  console.warn(
    `[CORS] Blocked request from origin: ${origin}`,
  );

  return callback(null, false);
};

export const corsOptions = {
  origin: originCallback,
  credentials: true,
  methods: [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  maxAge: 86400,
};
