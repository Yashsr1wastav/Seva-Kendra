import { Router } from "express";
const router = Router();
import groupLeaderController from "../../modules/education/controllers/groupLeader.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";

// Routes with authentication
router.get("/dropdown", verifyTokenExists, groupLeaderController.getGroupLeadersDropdown);
router.get("/stats", verifyTokenExists, groupLeaderController.getGroupLeadersStats);
router.get("/filter-options", verifyTokenExists, groupLeaderController.getFilterOptions);
router.get("/", verifyTokenExists, groupLeaderController.getAllGroupLeaders);
router.get("/:id", verifyTokenExists, groupLeaderController.getGroupLeaderById);
router.post("/", verifyTokenExists, groupLeaderController.createGroupLeader);
router.put("/:id", verifyTokenExists, groupLeaderController.updateGroupLeader);
router.delete("/:id", verifyTokenExists, groupLeaderController.deleteGroupLeader);

export default router;
