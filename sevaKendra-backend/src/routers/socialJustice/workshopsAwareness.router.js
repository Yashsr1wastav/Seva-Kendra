import { Router } from "express";
import {
  createWorkshopsAwareness,
  getAllWorkshopsAwareness,
  getWorkshopsAwarenessById,
  updateWorkshopsAwareness,
  deleteWorkshopsAwareness,
  getWorkshopsAwarenessStats,
  getWorkshopsAwarenessByWard,
  getWorkshopsAwarenessByHabitation,
  getWorkshopsAwarenessByGroupType,
  getWorkshopsAwarenessByCategory,
  addParticipant,
  updateParticipantAttendance,
  addLearningObjective,
  updateLearningObjective,
  addFollowUpAction,
  updateFollowUpActionStatus,
  getWorkshopsRequiringFollowUp,
  generateEffectivenessReport,
  getUpcomingWorkshops,
} from "../../modules/socialJustice/controllers/workshopsAwareness.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { createAutoFollowUp } from "../../middleware/autoTracking.middleware.js";

const router = Router();

// CRUD routes
router.post(
  "/",
  verifyTokenExists,
  createAutoFollowUp("Workshops"),
  createWorkshopsAwareness
);
router.get("/", verifyTokenExists, getAllWorkshopsAwareness);
router.get("/stats", verifyTokenExists, getWorkshopsAwarenessStats);
router.get("/follow-up", verifyTokenExists, getWorkshopsRequiringFollowUp);
router.get("/upcoming", verifyTokenExists, getUpcomingWorkshops);
router.get(
  "/effectiveness-report",
  verifyTokenExists,
  generateEffectivenessReport
);
router.get("/:id", verifyTokenExists, getWorkshopsAwarenessById);
router.put("/:id", verifyTokenExists, updateWorkshopsAwareness);
router.delete("/:id", verifyTokenExists, deleteWorkshopsAwareness);

// Filter routes
router.get("/ward/:wardNo", verifyTokenExists, getWorkshopsAwarenessByWard);
router.get(
  "/habitation/:habitation",
  verifyTokenExists,
  getWorkshopsAwarenessByHabitation
);
router.get(
  "/group-type/:groupType",
  verifyTokenExists,
  getWorkshopsAwarenessByGroupType
);
router.get(
  "/category/:trainingCategory",
  verifyTokenExists,
  getWorkshopsAwarenessByCategory
);

// Special action routes
router.post("/:id/participants", verifyTokenExists, addParticipant);
router.put(
  "/:id/participants/:participantId/attendance",
  verifyTokenExists,
  updateParticipantAttendance
);
router.post("/:id/objectives", verifyTokenExists, addLearningObjective);
router.put(
  "/:id/objectives/:objectiveId",
  verifyTokenExists,
  updateLearningObjective
);
router.post("/:id/follow-up-actions", verifyTokenExists, addFollowUpAction);
router.put(
  "/:id/follow-up-actions/:actionId/status",
  verifyTokenExists,
  updateFollowUpActionStatus
);

export default router;
