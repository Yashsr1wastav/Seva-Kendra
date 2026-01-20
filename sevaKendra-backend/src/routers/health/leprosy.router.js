import { Router } from "express";
const router = Router();
import leprosyController from "../../modules/health/controllers/leprosy.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, leprosyController.getAllLeprosy);
router.get("/stats", verifyTokenExists, leprosyController.getLeprosyStats);
router.get("/:id", verifyTokenExists, leprosyController.getLeprosyById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Leprosy"),
  leprosyController.createLeprosy
);
router.put("/:id", verifyTokenExists, leprosyController.updateLeprosy);
router.delete("/:id", verifyTokenExists, leprosyController.deleteLeprosy);

export default router;
