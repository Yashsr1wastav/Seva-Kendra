import { Router } from "express";
const router = Router();
import scStudentController from "../../modules/education/controllers/scStudent.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes
router.get("/", verifyTokenExists, scStudentController.getAllSCStudents);
router.get("/stats", verifyTokenExists, scStudentController.getSCStudentsStats);
router.get(
  "/filter-options",
  verifyTokenExists,
  scStudentController.getFilterOptions
);
router.get("/:id", verifyTokenExists, scStudentController.getSCStudentById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("SCStudents"),
  scStudentController.createSCStudent
);
router.put("/:id", verifyTokenExists, scStudentController.updateSCStudent);
router.delete("/:id", verifyTokenExists, scStudentController.deleteSCStudent);

export default router;
