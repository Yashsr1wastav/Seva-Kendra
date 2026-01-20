import { Router } from "express";
const router = Router();
import tuberculosisController from "../../modules/health/controllers/tuberculosis.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, tuberculosisController.getAllTuberculosis);
router.get(
  "/stats",
  verifyTokenExists,
  tuberculosisController.getTuberculosisStats
);
router.get(
  "/:id",
  verifyTokenExists,
  tuberculosisController.getTuberculosisById
);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Tuberculosis"),
  tuberculosisController.createTuberculosis
);
router.put(
  "/:id",
  verifyTokenExists,
  tuberculosisController.updateTuberculosis
);
router.delete(
  "/:id",
  verifyTokenExists,
  tuberculosisController.deleteTuberculosis
);

export default router;
