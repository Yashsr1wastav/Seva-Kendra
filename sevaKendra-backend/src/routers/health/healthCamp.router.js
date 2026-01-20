import { Router } from "express";
const router = Router();
import healthCampController from "../../modules/health/controllers/healthCamp.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, healthCampController.getAllHealthCamps);
router.get(
  "/stats",
  verifyTokenExists,
  healthCampController.getHealthCampsStats
);
router.get("/:id", verifyTokenExists, healthCampController.getHealthCampById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("HealthCamps"),
  healthCampController.createHealthCamp
);
router.put("/:id", verifyTokenExists, healthCampController.updateHealthCamp);
router.delete("/:id", verifyTokenExists, healthCampController.deleteHealthCamp);

export default router;
