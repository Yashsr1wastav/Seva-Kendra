import teacherService from "../services/teacher.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const teacherController = {
  // Get all teachers
  getAllTeachers: errorWrapper(async (req, res) => {
    const result = await teacherService.getAllTeachers(req.query);
    return successResponse(res, result, "Teachers fetched successfully");
  }),

  // Get teachers dropdown
  getTeachersDropdown: errorWrapper(async (req, res) => {
    const result = await teacherService.getTeachersDropdown();
    return successResponse(res, result, "Teachers dropdown fetched successfully");
  }),

  // Get teacher by ID
  getTeacherById: errorWrapper(async (req, res) => {
    const teacher = await teacherService.getTeacherById(req.params.id);
    return successResponse(res, teacher, "Teacher fetched successfully");
  }),

  // Create new teacher
  createTeacher: errorWrapper(async (req, res) => {
    const teacher = await teacherService.createTeacher(req.body, req.user.id);
    return successResponse(res, teacher, "Teacher created successfully", 201);
  }),

  // Update teacher
  updateTeacher: errorWrapper(async (req, res) => {
    const teacher = await teacherService.updateTeacherById(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, teacher, "Teacher updated successfully");
  }),

  // Delete teacher
  deleteTeacher: errorWrapper(async (req, res) => {
    await teacherService.deleteTeacherById(req.params.id);
    return successResponse(res, null, "Teacher deleted successfully");
  }),

  // Get teachers statistics
  getTeachersStats: errorWrapper(async (req, res) => {
    const stats = await teacherService.getTeachersStats();
    return successResponse(res, stats, "Teachers statistics fetched successfully");
  }),

  // Get filter options
  getFilterOptions: errorWrapper(async (req, res) => {
    const options = await teacherService.getFilterOptions();
    return successResponse(res, options, "Filter options fetched successfully");
  }),
};

export default teacherController;
