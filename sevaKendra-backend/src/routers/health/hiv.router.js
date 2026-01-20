import { Router } from "express";
const router = Router();
import hivController from "../../modules/health/controllers/hiv.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, hivController.getAllHIV);
router.get("/stats", verifyTokenExists, hivController.getHIVStats);
router.get("/:id", verifyTokenExists, hivController.getHIVById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("HIV"),
  hivController.createHIV
);
router.put("/:id", verifyTokenExists, hivController.updateHIV);
router.delete("/:id", verifyTokenExists, hivController.deleteHIV);

export default router;
