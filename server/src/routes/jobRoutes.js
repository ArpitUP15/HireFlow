const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  publishJob,
  closeJob,
} = require("../controllers/jobController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  organizationMiddleware,
} = require("../middleware/organizationMiddleware");

const router = express.Router();

router.use(protect);
router.use(organizationMiddleware);

router.post("/", createJob);

router.get("/", getJobs);

router.get("/:id", getJobById);

router.put("/:id", updateJob);

router.delete("/:id", deleteJob);

router.patch(
  "/:id/publish",
  publishJob
);

router.patch(
  "/:id/close",
  closeJob
);

module.exports = router;