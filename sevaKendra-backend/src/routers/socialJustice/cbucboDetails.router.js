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
import { checkPermission } from "../../middleware/permissionMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

const router = Router();

// CRUD routes
router.post(
  "/",
  verifyTokenExists,
  checkPermission("socialJustice", "create"),
  createAutoFollowUp("CBUCBODetails"),
  createCBUCBODetails
);
router.get("/", verifyTokenExists, checkPermission("socialJustice", "view"), getAllCBUCBODetails);
router.get("/stats", verifyTokenExists, checkPermission("socialJustice", "view"), getCBUCBODetailsStats);
router.get("/:id", verifyTokenExists, checkPermission("socialJustice", "view"), getCBUCBODetailsById);
router.put("/:id", verifyTokenExists, checkPermission("socialJustice", "edit"), updateCBUCBODetails);
router.delete("/:id", verifyTokenExists, checkPermission("socialJustice", "delete"), deleteCBUCBODetails);

// Filter routes
router.get("/ward/:wardNo", verifyTokenExists, checkPermission("socialJustice", "view"), getCBUCBODetailsByWard);
router.get(
  "/habitation/:habitation",
  verifyTokenExists,
  checkPermission("socialJustice", "view"),
  getCBUCBODetailsByHabitation
);
router.get(
  "/group-type/:groupType",
  verifyTokenExists,
  checkPermission("socialJustice", "view"),
  getCBUCBODetailsByGroupType
);
router.get("/status/:status", verifyTokenExists, checkPermission("socialJustice", "view"), getCBUCBODetailsByStatus);

// Special action routes
router.put("/:id/members", verifyTokenExists, checkPermission("socialJustice", "edit"), updateMemberDetails);
router.post(
  "/:id/capacity-building",
  verifyTokenExists,
  checkPermission("socialJustice", "edit"),
  addCapacityBuildingActivity
);
router.put("/:id/progress", verifyTokenExists, checkPermission("socialJustice", "edit"), updateProgressReport);

export default router;
