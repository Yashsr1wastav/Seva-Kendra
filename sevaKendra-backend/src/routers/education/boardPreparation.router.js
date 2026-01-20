import { Router } from "express";
const router = Router();
import boardPreparationController from "../../modules/education/controllers/boardPreparation.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

// Routes
router.get(
  "/",
  verifyTokenExists,
  boardPreparationController.getAllBoardPreparations
);
router.get(
  "/stats",
  verifyTokenExists,
  boardPreparationController.getBoardPreparationsStats
);
router.get(
  "/filter-options",
  verifyTokenExists,
  boardPreparationController.getFilterOptions
);
router.get(
  "/:id",
  verifyTokenExists,
  boardPreparationController.getBoardPreparationById
);
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("BoardPreparation"),
  boardPreparationController.createBoardPreparation
);
router.put(
  "/:id",
  verifyTokenExists,
  boardPreparationController.updateBoardPreparation
);
router.delete(
  "/:id",
  verifyTokenExists,
  boardPreparationController.deleteBoardPreparation
);

export default router;
