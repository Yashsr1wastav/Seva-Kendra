import { Router } from "express";
const router = Router();
import studyCenterController from "../../modules/education/controllers/studyCenter.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, studyCenterController.getAllStudyCenters);
router.get(
  "/stats",
  verifyTokenExists,
  studyCenterController.getStudyCentersStats
);
router.get(
  "/filter-options",
  verifyTokenExists,
  studyCenterController.getFilterOptions
);
router.get("/:id", verifyTokenExists, studyCenterController.getStudyCenterById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("StudyCenters"),
  studyCenterController.createStudyCenter
);
router.put("/:id", verifyTokenExists, studyCenterController.updateStudyCenter);
router.delete(
  "/:id",
  verifyTokenExists,
  studyCenterController.deleteStudyCenter
);

export default router;
