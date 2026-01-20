import { Router } from "express";
const router = Router();
import dropoutController from "../../modules/education/controllers/dropout.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes
router.get("/", verifyTokenExists, dropoutController.getAllDropouts);
router.get("/stats", verifyTokenExists, dropoutController.getDropoutsStats);
router.get(
  "/filter-options",
  verifyTokenExists,
  dropoutController.getFilterOptions
);
router.get("/:id", verifyTokenExists, dropoutController.getDropoutById);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Dropouts"),
  dropoutController.createDropout
);
router.put("/:id", verifyTokenExists, dropoutController.updateDropout);
router.delete("/:id", verifyTokenExists, dropoutController.deleteDropout);

export default router;
