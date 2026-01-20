import studyCenterService from "../services/studyCenter.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const studyCenterController = {
  // Get all study centers
  getAllStudyCenters: errorWrapper(async (req, res) => {
    const result = await studyCenterService.getAllStudyCenters(req.query);
    return successResponse(res, result, "Study centers fetched successfully");
  }),

  // Get study center by ID
  getStudyCenterById: errorWrapper(async (req, res) => {
    const studyCenter = await studyCenterService.getStudyCenterById(
      req.params.id
    );
    return successResponse(
      res,
      studyCenter,
      "Study center fetched successfully"
    );
  }),

  // Create new study center
  createStudyCenter: errorWrapper(async (req, res) => {
    const studyCenter = await studyCenterService.createStudyCenter(
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      studyCenter,
      "Study center created successfully",
      201
    );
  }),

  // Update study center
  updateStudyCenter: errorWrapper(async (req, res) => {
    const studyCenter = await studyCenterService.updateStudyCenterById(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      studyCenter,
      "Study center updated successfully"
    );
  }),

  // Delete study center
  deleteStudyCenter: errorWrapper(async (req, res) => {
    await studyCenterService.deleteStudyCenterById(req.params.id);
    return successResponse(res, null, "Study center deleted successfully");
  }),

  // Get study centers statistics
  getStudyCentersStats: errorWrapper(async (req, res) => {
    const stats = await studyCenterService.getStudyCentersStats();
    return successResponse(
      res,
      stats,
      "Study centers statistics fetched successfully"
    );
  }),

  // Get filter options
  getFilterOptions: errorWrapper(async (req, res) => {
    const options = await studyCenterService.getFilterOptions();
    return successResponse(res, options, "Filter options fetched successfully");
  }),
};

export default studyCenterController;
