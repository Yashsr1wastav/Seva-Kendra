import scStudentService from "../services/scStudent.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const scStudentController = {
  // Get all SC students
  getAllSCStudents: errorWrapper(async (req, res) => {
    const result = await scStudentService.getAllSCStudents(req.query);
    return successResponse(res, result, "SC students fetched successfully");
  }),

  // Get SC student by ID
  getSCStudentById: errorWrapper(async (req, res) => {
    const student = await scStudentService.getSCStudentById(req.params.id);
    return successResponse(res, student, "SC student fetched successfully");
  }),

  // Create new SC student
  createSCStudent: errorWrapper(async (req, res) => {
    const student = await scStudentService.createSCStudent(
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      student,
      "SC student created successfully",
      201
    );
  }),

  // Update SC student
  updateSCStudent: errorWrapper(async (req, res) => {
    const student = await scStudentService.updateSCStudentById(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, student, "SC student updated successfully");
  }),

  // Delete SC student
  deleteSCStudent: errorWrapper(async (req, res) => {
    await scStudentService.deleteSCStudentById(req.params.id);
    return successResponse(res, null, "SC student deleted successfully");
  }),

  // Get SC students statistics
  getSCStudentsStats: errorWrapper(async (req, res) => {
    const stats = await scStudentService.getSCStudentsStats();
    return successResponse(
      res,
      stats,
      "SC students statistics fetched successfully"
    );
  }),

  // Get filter options
  getFilterOptions: errorWrapper(async (req, res) => {
    const options = await scStudentService.getFilterOptions();
    return successResponse(res, options, "Filter options fetched successfully");
  }),
};

export default scStudentController;
