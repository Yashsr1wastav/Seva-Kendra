import { Router } from "express";
const router = Router();
import pwdController from "../../modules/health/controllers/pwd.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, pwdController.getAllPWD);
router.get("/stats", verifyTokenExists, pwdController.getPWDStats);
router.get("/:id", verifyTokenExists, pwdController.getPWDById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("PWD"),
  pwdController.createPWD
);
router.put("/:id", verifyTokenExists, pwdController.updatePWD);
router.delete("/:id", verifyTokenExists, pwdController.deletePWD);

export default router;
