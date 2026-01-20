import { Router } from "express";
const router = Router();
import addictionController from "../../modules/health/controllers/addiction.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, addictionController.getAllAddiction);
router.get("/stats", verifyTokenExists, addictionController.getAddictionStats);
router.get("/:id", verifyTokenExists, addictionController.getAddictionById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Addiction"),
  addictionController.createAddiction
);
router.put("/:id", verifyTokenExists, addictionController.updateAddiction);
router.delete("/:id", verifyTokenExists, addictionController.deleteAddiction);

export default router;
