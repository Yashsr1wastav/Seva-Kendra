import { Router } from "express";
const router = Router();
import motherChildController from "../../modules/health/controllers/motherChild.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, motherChildController.getAllMotherChild);
router.get(
  "/stats",
  verifyTokenExists,
  motherChildController.getMotherChildStats
);
router.get("/:id", verifyTokenExists, motherChildController.getMotherChildById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("MotherChild"),
  motherChildController.createMotherChild
);
router.put("/:id", verifyTokenExists, motherChildController.updateMotherChild);
router.delete(
  "/:id",
  verifyTokenExists,
  motherChildController.deleteMotherChild
);

export default router;
