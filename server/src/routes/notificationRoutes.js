import express from "express";

import {
  getNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";

import protect from "../middleware/authMiddleware.js";
import organizationMiddleware from "../middleware/organizationMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(organizationMiddleware);

router.get("/", getNotifications);

router.patch(
  "/:id/read",
  markNotificationRead
);

export default router;