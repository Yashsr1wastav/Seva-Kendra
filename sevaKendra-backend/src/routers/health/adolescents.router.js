import { Router } from "express";
const router = Router();
import adolescentsController from "../../modules/health/controllers/adolescents.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, adolescentsController.getAllAdolescents);
router.get(
  "/stats",
  verifyTokenExists,
  adolescentsController.getAdolescentStats
);
router.get("/:id", verifyTokenExists, adolescentsController.getAdolescentById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Adolescents"),
  adolescentsController.createAdolescent
);
router.put("/:id", verifyTokenExists, adolescentsController.updateAdolescent);
router.delete(
  "/:id",
  verifyTokenExists,
  adolescentsController.deleteAdolescent
);

export default router;
