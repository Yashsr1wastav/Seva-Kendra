import schoolService from "../services/school.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const schoolController = {
  // Get all schools
  getAllSchools: errorWrapper(async (req, res) => {
    const result = await schoolService.getAllSchools(req.query);
    return successResponse(res, result, "Schools fetched successfully");
  }),

  // Get school by ID
  getSchoolById: errorWrapper(async (req, res) => {
    const school = await schoolService.getSchoolById(req.params.id);
    return successResponse(res, school, "School fetched successfully");
  }),

  // Create new school
  createSchool: errorWrapper(async (req, res) => {
    const school = await schoolService.createSchool(req.body, req.user.id);
    return successResponse(res, school, "School created successfully", 201);
  }),

  // Update school
  updateSchool: errorWrapper(async (req, res) => {
    const school = await schoolService.updateSchoolById(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, school, "School updated successfully");
  }),

  // Delete school
  deleteSchool: errorWrapper(async (req, res) => {
    await schoolService.deleteSchoolById(req.params.id);
    return successResponse(res, null, "School deleted successfully");
  }),

  // Get schools statistics
  getSchoolsStats: errorWrapper(async (req, res) => {
    const stats = await schoolService.getSchoolsStats();
    return successResponse(
      res,
      stats,
      "Schools statistics fetched successfully"
    );
  }),

  // Get filter options
  getFilterOptions: errorWrapper(async (req, res) => {
    const options = await schoolService.getFilterOptions();
    return successResponse(res, options, "Filter options fetched successfully");
  }),
};

export default schoolController;
