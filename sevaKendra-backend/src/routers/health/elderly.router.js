import { Router } from "express";
const router = Router();
import elderlyController from "../../modules/health/controllers/elderly.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, elderlyController.getAllElderly);
router.get("/stats", verifyTokenExists, elderlyController.getElderlyStats);
router.get("/:id", verifyTokenExists, elderlyController.getElderlyById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Elderly"),
  elderlyController.createElderly
);
router.put("/:id", verifyTokenExists, elderlyController.updateElderly);
router.delete("/:id", verifyTokenExists, elderlyController.deleteElderly);

export default router;
