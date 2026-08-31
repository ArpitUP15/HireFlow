const express = require("express");

const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  organizationMiddleware,
} = require("../middleware/organizationMiddleware");

const router = express.Router();

router.use(protect);
router.use(organizationMiddleware);

router.post(
  "/",
  createCandidate
);

router.get(
  "/",
  getCandidates
);

router.get(
  "/:id",
  getCandidateById
);

router.put(
  "/:id",
  updateCandidate
);

router.delete(
  "/:id",
  deleteCandidate
);

module.exports = router;