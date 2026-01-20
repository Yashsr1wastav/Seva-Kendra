import { Router } from "express";
const router = Router();
import competitiveExamController from "../../modules/education/controllers/competitiveExam.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes
router.get(
  "/",
  verifyTokenExists,
  competitiveExamController.getAllCompetitiveExams
);
router.get(
  "/stats",
  verifyTokenExists,
  competitiveExamController.getCompetitiveExamsStats
);
router.get(
  "/filter-options",
  verifyTokenExists,
  competitiveExamController.getFilterOptions
);
router.get(
  "/:id",
  verifyTokenExists,
  competitiveExamController.getCompetitiveExamById
);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("CompetitiveExams"),
  competitiveExamController.createCompetitiveExam
);
router.put(
  "/:id",
  verifyTokenExists,
  competitiveExamController.updateCompetitiveExam
);
router.delete(
  "/:id",
  verifyTokenExists,
  competitiveExamController.deleteCompetitiveExam
);

export default router;
