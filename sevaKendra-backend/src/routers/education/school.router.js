import { Router } from "express";
const router = Router();
import schoolController from "../../modules/education/controllers/school.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes
router.get("/", verifyTokenExists, schoolController.getAllSchools);
router.get("/stats", verifyTokenExists, schoolController.getSchoolsStats);
router.get(
  "/filter-options",
  verifyTokenExists,
  schoolController.getFilterOptions
);
router.get("/:id", verifyTokenExists, schoolController.getSchoolById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Schools"),
  schoolController.createSchool
);
router.put("/:id", verifyTokenExists, schoolController.updateSchool);
router.delete("/:id", verifyTokenExists, schoolController.deleteSchool);

export default router;
