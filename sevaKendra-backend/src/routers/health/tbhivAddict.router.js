import { Router } from "express";
const router = Router();
import tbhivAddictController from "../../modules/health/controllers/tbhivAddict.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";

// Routes with authentication
router.get("/", verifyTokenExists, tbhivAddictController.getAllTBHIVAddict);
router.get(
  "/stats",
  verifyTokenExists,
  tbhivAddictController.getTBHIVAddictStats
);
router.get("/:id", verifyTokenExists, tbhivAddictController.getTBHIVAddictById);
router.post("/", verifyTokenExists, tbhivAddictController.createTBHIVAddict);
router.put("/:id", verifyTokenExists, tbhivAddictController.updateTBHIVAddict);
router.delete(
  "/:id",
  verifyTokenExists,
  tbhivAddictController.deleteTBHIVAddict
);

export default router;
