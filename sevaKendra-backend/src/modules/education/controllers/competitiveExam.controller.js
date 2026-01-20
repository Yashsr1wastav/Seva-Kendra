import competitiveExamService from "../services/competitiveExam.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const competitiveExamController = {
  // Get all competitive exams
  getAllCompetitiveExams: errorWrapper(async (req, res) => {
    const result = await competitiveExamService.getAllCompetitiveExams(
      req.query
    );
    return successResponse(
      res,
      result,
      "Competitive exams fetched successfully"
    );
  }),

  // Get competitive exam by ID
  getCompetitiveExamById: errorWrapper(async (req, res) => {
    const exam = await competitiveExamService.getCompetitiveExamById(
      req.params.id
    );
    return successResponse(res, exam, "Competitive exam fetched successfully");
  }),

  // Create new competitive exam
  createCompetitiveExam: errorWrapper(async (req, res) => {
    const exam = await competitiveExamService.createCompetitiveExam(
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      exam,
      "Competitive exam created successfully",
      201
    );
  }),

  // Update competitive exam
  updateCompetitiveExam: errorWrapper(async (req, res) => {
    const exam = await competitiveExamService.updateCompetitiveExamById(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, exam, "Competitive exam updated successfully");
  }),

  // Delete competitive exam
  deleteCompetitiveExam: errorWrapper(async (req, res) => {
    await competitiveExamService.deleteCompetitiveExamById(req.params.id);
    return successResponse(res, null, "Competitive exam deleted successfully");
  }),

  // Get competitive exams statistics
  getCompetitiveExamsStats: errorWrapper(async (req, res) => {
    const stats = await competitiveExamService.getCompetitiveExamsStats();
    return successResponse(
      res,
      stats,
      "Competitive exams statistics fetched successfully"
    );
  }),

  // Get filter options
  getFilterOptions: errorWrapper(async (req, res) => {
    const options = await competitiveExamService.getFilterOptions();
    return successResponse(res, options, "Filter options fetched successfully");
  }),
};

export default competitiveExamController;
