import { Router } from "express";
import { isAllowedOrigin } from "../config/cors.js";
import rateLimit from "express-rate-limit";
import protect from "../middleware/authMiddleware.js";
import organizationMiddleware, {
  requireOrganizationRole,
} from "../middleware/organizationMiddleware.js";
import { resumeUpload } from "../middleware/aiUpload.js";
import { processAI, history, metrics } from "../controllers/aiController.js";
const router = Router();
router.use(
  protect,
  organizationMiddleware,
  requireOrganizationRole("owner", "hr_admin", "recruiter"),
);
router.use((req, res, next) => {
  const requested = req.get("x-organization-id");
  if (requested && requested !== String(req.organization._id))
    return res
      .status(403)
      .json({
        success: false,
        message: "Access to the requested organization is denied",
      });
  const origin = req.get("origin");
  if (
  !["GET", "HEAD"].includes(req.method) &&
  !isAllowedOrigin(origin)
)
    return res
      .status(403)
      .json({ success: false, message: "Untrusted request origin" });
  next();
});
router.get("/history", history);
router.get("/metrics", metrics);
router.use(
  rateLimit({
    windowMs: 60000,
    limit: 10,
    keyGenerator: (req) => String(req.user._id),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many AI requests. Retry in a minute.",
    },
  }),
);
router.post(
  "/parse-resume",
  resumeUpload.single("resume"),
  processAI("resume"),
);
router.post("/screen", processAI("screening"));
router.post("/match", processAI("matching"));
router.post("/interview-questions", processAI("interview"));
router.post("/screen/:candidateId", processAI("screening", true));
export default router;
