import { Router } from "express";
const router = Router();
import otherDiseasesController from "../../modules/health/controllers/otherDiseases.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, otherDiseasesController.getAllOtherDiseases);
router.get(
  "/stats",
  verifyTokenExists,
  otherDiseasesController.getOtherDiseasesStats
);
router.get(
  "/:id",
  verifyTokenExists,
  otherDiseasesController.getOtherDiseasesById
);
router.post(
  "/",
  verifyTokenExists,
  otherDiseasesController.createOtherDiseases
);
router.put(
  "/:id",
  verifyTokenExists,
  otherDiseasesController.updateOtherDiseases
);
router.delete(
  "/:id",
  verifyTokenExists,
  otherDiseasesController.deleteOtherDiseases
);

export default router;
