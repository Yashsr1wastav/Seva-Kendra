import { Router } from "express";
import {
  createEntitlements,
  getAllEntitlements,
  getEntitlementsById,
  updateEntitlements,
  deleteEntitlements,
  getEntitlementsStats,
  getEntitlementsByWard,
  getEntitlementsByHabitation,
  getEntitlementsByStatus,
  getEntitlementsByIdProofType,
  addEligibleScheme,
  updateSchemeStatus,
  addProgressReport,
  updateProgressReport,
  getEntitlementsByScheme,
} from "../../modules/socialJustice/controllers/entitlements.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

const router = Router();

// CRUD routes
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Entitlements"),
  createEntitlements
);
router.get("/", verifyTokenExists, getAllEntitlements);
router.get("/stats", verifyTokenExists, getEntitlementsStats);
router.get("/:id", verifyTokenExists, getEntitlementsById);
router.put("/:id", verifyTokenExists, updateEntitlements);
router.delete("/:id", verifyTokenExists, deleteEntitlements);

// Filter routes
router.get("/ward/:wardNo", verifyTokenExists, getEntitlementsByWard);
router.get(
  "/habitation/:habitation",
  verifyTokenExists,
  getEntitlementsByHabitation
);
router.get(
  "/status/:applicationStatus",
  verifyTokenExists,
  getEntitlementsByStatus
);
router.get(
  "/id-proof/:idProofType",
  verifyTokenExists,
  getEntitlementsByIdProofType
);
router.get("/scheme/:schemeName", verifyTokenExists, getEntitlementsByScheme);

// Special action routes
router.post("/:id/schemes", verifyTokenExists, addEligibleScheme);
router.put(
  "/:id/schemes/:schemeId/status",
  verifyTokenExists,
  updateSchemeStatus
);
router.post("/:id/progress", verifyTokenExists, addProgressReport);
router.put("/:id/progress/:reportId", verifyTokenExists, updateProgressReport);

export default router;
