import boardPreparationService from "../services/boardPreparation.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const boardPreparationController = {
  // Get all board preparations
  getAllBoardPreparations: errorWrapper(async (req, res) => {
    const result = await boardPreparationService.getAllBoardPreparations(
      req.query
    );
    return successResponse(
      res,
      result,
      "Board preparations fetched successfully"
    );
  }),

  // Get board preparation by ID
  getBoardPreparationById: errorWrapper(async (req, res) => {
    const preparation = await boardPreparationService.getBoardPreparationById(
      req.params.id
    );
    return successResponse(
      res,
      preparation,
      "Board preparation fetched successfully"
    );
  }),

  // Create new board preparation
  createBoardPreparation: errorWrapper(async (req, res) => {
    const preparation = await boardPreparationService.createBoardPreparation(
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      preparation,
      "Board preparation created successfully",
      201
    );
  }),

  // Update board preparation
  updateBoardPreparation: errorWrapper(async (req, res) => {
    const preparation =
      await boardPreparationService.updateBoardPreparationById(
        req.params.id,
        req.body,
        req.user.id
      );
    return successResponse(
      res,
      preparation,
      "Board preparation updated successfully"
    );
  }),

  // Delete board preparation
  deleteBoardPreparation: errorWrapper(async (req, res) => {
    await boardPreparationService.deleteBoardPreparationById(req.params.id);
    return successResponse(res, null, "Board preparation deleted successfully");
  }),

  // Get board preparations statistics
  getBoardPreparationsStats: errorWrapper(async (req, res) => {
    const stats = await boardPreparationService.getBoardPreparationsStats();
    return successResponse(
      res,
      stats,
      "Board preparations statistics fetched successfully"
    );
  }),

  // Get filter options
  getFilterOptions: errorWrapper(async (req, res) => {
    const options = await boardPreparationService.getFilterOptions();
    return successResponse(res, options, "Filter options fetched successfully");
  }),
};

export default boardPreparationController;
