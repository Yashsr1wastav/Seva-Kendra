import groupLeaderService from "../services/groupLeader.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const groupLeaderController = {
  // Get all group leaders
  getAllGroupLeaders: errorWrapper(async (req, res) => {
    const result = await groupLeaderService.getAllGroupLeaders(req.query);
    return successResponse(res, result, "Group leaders fetched successfully");
  }),

  // Get group leaders dropdown
  getGroupLeadersDropdown: errorWrapper(async (req, res) => {
    const result = await groupLeaderService.getGroupLeadersDropdown();
    return successResponse(res, result, "Group leaders dropdown fetched successfully");
  }),

  // Get group leader by ID
  getGroupLeaderById: errorWrapper(async (req, res) => {
    const groupLeader = await groupLeaderService.getGroupLeaderById(req.params.id);
    return successResponse(res, groupLeader, "Group leader fetched successfully");
  }),

  // Create new group leader
  createGroupLeader: errorWrapper(async (req, res) => {
    const groupLeader = await groupLeaderService.createGroupLeader(
      req.body,
      req.user.id
    );
    return successResponse(res, groupLeader, "Group leader created successfully", 201);
  }),

  // Update group leader
  updateGroupLeader: errorWrapper(async (req, res) => {
    const groupLeader = await groupLeaderService.updateGroupLeaderById(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, groupLeader, "Group leader updated successfully");
  }),

  // Delete group leader
  deleteGroupLeader: errorWrapper(async (req, res) => {
    await groupLeaderService.deleteGroupLeaderById(req.params.id);
    return successResponse(res, null, "Group leader deleted successfully");
  }),

  // Get group leaders statistics
  getGroupLeadersStats: errorWrapper(async (req, res) => {
    const stats = await groupLeaderService.getGroupLeadersStats();
    return successResponse(res, stats, "Group leaders statistics fetched successfully");
  }),

  // Get filter options
  getFilterOptions: errorWrapper(async (req, res) => {
    const options = await groupLeaderService.getFilterOptions();
    return successResponse(res, options, "Filter options fetched successfully");
  }),
};

export default groupLeaderController;
