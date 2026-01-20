import { Router } from "express";
import {
  createLegalAidService,
  getAllLegalAidServices,
  getLegalAidServiceById,
  updateLegalAidService,
  deleteLegalAidService,
  getLegalAidServiceStats,
  getLegalAidServicesByWard,
  getLegalAidServicesByHabitation,
  getLegalAidServicesByCaseType,
  getLegalAidServicesByCaseStatus,
  getLegalAidServicesByPriority,
  addInterventionStep,
  updateInterventionStep,
  updateCaseStatus,
  getCasesRequiringFollowUp,
  getCaseTimeline,
  generateCaseReport,
} from "../../modules/socialJustice/controllers/legalAidService.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

const router = Router();

// CRUD routes
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("LegalAid"),
  createLegalAidService
);
router.get("/", verifyTokenExists, getAllLegalAidServices);
router.get("/stats", verifyTokenExists, getLegalAidServiceStats);
router.get("/follow-up", verifyTokenExists, getCasesRequiringFollowUp);
router.get("/report", verifyTokenExists, generateCaseReport);
router.get("/:id", verifyTokenExists, getLegalAidServiceById);
router.put("/:id", verifyTokenExists, updateLegalAidService);
router.delete("/:id", verifyTokenExists, deleteLegalAidService);

// Filter routes
router.get("/ward/:wardNo", verifyTokenExists, getLegalAidServicesByWard);
router.get(
  "/habitation/:habitation",
  verifyTokenExists,
  getLegalAidServicesByHabitation
);
router.get(
  "/case-type/:caseType",
  verifyTokenExists,
  getLegalAidServicesByCaseType
);
router.get(
  "/case-status/:caseStatus",
  verifyTokenExists,
  getLegalAidServicesByCaseStatus
);
router.get(
  "/priority/:priorityLevel",
  verifyTokenExists,
  getLegalAidServicesByPriority
);

// Special action routes
router.get("/:id/timeline", verifyTokenExists, getCaseTimeline);
router.post("/:id/interventions", verifyTokenExists, addInterventionStep);
router.put(
  "/:id/interventions/:stepId",
  verifyTokenExists,
  updateInterventionStep
);
router.put("/:id/status", verifyTokenExists, updateCaseStatus);

export default router;
