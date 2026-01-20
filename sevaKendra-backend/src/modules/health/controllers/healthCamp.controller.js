import * as healthCampService from "../services/healthCamp.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const healthCampController = {
  // Get all health camps
  getAllHealthCamps: errorWrapper(async (req, res) => {
    const result = await healthCampService.getAllHealthCamps(req.query);
    return successResponse(res, result, "Health camps fetched successfully");
  }),

  // Get health camp by ID
  getHealthCampById: errorWrapper(async (req, res) => {
    const healthCamp = await healthCampService.getHealthCampById(req.params.id);
    return successResponse(res, healthCamp, "Health camp fetched successfully");
  }),

  // Create new health camp
  createHealthCamp: errorWrapper(async (req, res) => {
    const healthCamp = await healthCampService.createHealthCamp(
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      healthCamp,
      "Health camp created successfully",
      201
    );
  }),

  // Update health camp
  updateHealthCamp: errorWrapper(async (req, res) => {
    const healthCamp = await healthCampService.updateHealthCamp(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, healthCamp, "Health camp updated successfully");
  }),

  // Delete health camp
  deleteHealthCamp: errorWrapper(async (req, res) => {
    await healthCampService.deleteHealthCamp(req.params.id);
    return successResponse(res, null, "Health camp deleted successfully");
  }),

  // Get health camps statistics
  getHealthCampsStats: errorWrapper(async (req, res) => {
    const stats = await healthCampService.getHealthCampStats();
    return successResponse(
      res,
      stats,
      "Health camps statistics fetched successfully"
    );
  }),
};

export default healthCampController;
