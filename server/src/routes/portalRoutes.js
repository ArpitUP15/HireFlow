import express from "express";
import {
  applyToPortalJob,
  downloadMyResume,
  getMyApplications,
  getMyProfile,
  getPortalJobs,
  updateMyProfile,
  uploadMyResume,
} from "../controllers/portalController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import portalResumeUpload, {
  handlePortalResumeUploadError,
} from "../middleware/portalResumeUpload.js";

const router = express.Router();

router.use(protect, authorize("candidate"));

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.post(
  "/profile/resume",
  portalResumeUpload.single("resume"),
  handlePortalResumeUploadError,
  uploadMyResume,
);
router.get("/profile/resume", downloadMyResume);
router.get("/applications", getMyApplications);
router.get("/jobs", getPortalJobs);
router.post("/jobs/:id/apply", applyToPortalJob);

export default router;
