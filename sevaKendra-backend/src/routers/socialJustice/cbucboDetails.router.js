import { Router } from "express";
import {
  createCBUCBODetails,
  getAllCBUCBODetails,
  getCBUCBODetailsById,
  updateCBUCBODetails,
  deleteCBUCBODetails,
  getCBUCBODetailsStats,
  getCBUCBODetailsByWard,
  getCBUCBODetailsByHabitation,
  getCBUCBODetailsByGroupType,
  getCBUCBODetailsByStatus,
  updateMemberDetails,
  addCapacityBuildingActivity,
  updateProgressReport,
} from "../../modules/socialJustice/controllers/cbucboDetails.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

const router = Router();

// CRUD routes
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("CBUCBODetails"),
  createCBUCBODetails
);
router.get("/", verifyTokenExists, getAllCBUCBODetails);
router.get("/stats", verifyTokenExists, getCBUCBODetailsStats);
router.get("/:id", verifyTokenExists, getCBUCBODetailsById);
router.put("/:id", verifyTokenExists, updateCBUCBODetails);
router.delete("/:id", verifyTokenExists, deleteCBUCBODetails);

// Filter routes
router.get("/ward/:wardNo", verifyTokenExists, getCBUCBODetailsByWard);
router.get(
  "/habitation/:habitation",
  verifyTokenExists,
  getCBUCBODetailsByHabitation
);
router.get(
  "/group-type/:groupType",
  verifyTokenExists,
  getCBUCBODetailsByGroupType
);
router.get("/status/:status", verifyTokenExists, getCBUCBODetailsByStatus);

// Special action routes
router.put("/:id/members", verifyTokenExists, updateMemberDetails);
router.post(
  "/:id/capacity-building",
  verifyTokenExists,
  addCapacityBuildingActivity
);
router.put("/:id/progress", verifyTokenExists, updateProgressReport);

export default router;
