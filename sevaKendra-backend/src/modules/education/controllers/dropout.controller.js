import dropoutService from "../services/dropout.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const dropoutController = {
  // Get all dropouts
  getAllDropouts: errorWrapper(async (req, res) => {
    const result = await dropoutService.getAllDropouts(req.query);
    return successResponse(res, result, "Dropouts fetched successfully");
  }),

  // Get dropout by ID
  getDropoutById: errorWrapper(async (req, res) => {
    const dropout = await dropoutService.getDropoutById(req.params.id);
    return successResponse(res, dropout, "Dropout fetched successfully");
  }),

  // Create new dropout
  createDropout: errorWrapper(async (req, res) => {
    const dropout = await dropoutService.createDropout(req.body, req.user.id);
    return successResponse(res, dropout, "Dropout created successfully", 201);
  }),

  // Update dropout
  updateDropout: errorWrapper(async (req, res) => {
    const dropout = await dropoutService.updateDropoutById(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, dropout, "Dropout updated successfully");
  }),

  // Delete dropout
  deleteDropout: errorWrapper(async (req, res) => {
    await dropoutService.deleteDropoutById(req.params.id);
    return successResponse(res, null, "Dropout deleted successfully");
  }),

  // Get dropouts statistics
  getDropoutsStats: errorWrapper(async (req, res) => {
    const stats = await dropoutService.getDropoutsStats();
    return successResponse(
      res,
      stats,
      "Dropouts statistics fetched successfully"
    );
  }),

  // Get filter options
  getFilterOptions: errorWrapper(async (req, res) => {
    const options = await dropoutService.getFilterOptions();
    return successResponse(res, options, "Filter options fetched successfully");
  }),
};

export default dropoutController;
