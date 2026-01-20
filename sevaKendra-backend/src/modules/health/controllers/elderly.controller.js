import * as elderlyService from "../services/elderly.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const elderlyController = {
  // Get all elderly records
  getAllElderly: errorWrapper(async (req, res) => {
    const result = await elderlyService.getAllElderly(req.query);
    return successResponse(res, result, "Elderly records fetched successfully");
  }),

  // Get elderly record by ID
  getElderlyById: errorWrapper(async (req, res) => {
    const elderly = await elderlyService.getElderlyById(req.params.id);
    return successResponse(res, elderly, "Elderly record fetched successfully");
  }),

  // Create new elderly record
  createElderly: errorWrapper(async (req, res) => {
    const elderly = await elderlyService.createElderly(req.body, req.user.id);
    return successResponse(
      res,
      elderly,
      "Elderly record created successfully",
      201
    );
  }),

  // Update elderly record
  updateElderly: errorWrapper(async (req, res) => {
    const elderly = await elderlyService.updateElderly(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, elderly, "Elderly record updated successfully");
  }),

  // Delete elderly record
  deleteElderly: errorWrapper(async (req, res) => {
    await elderlyService.deleteElderly(req.params.id);
    return successResponse(res, null, "Elderly record deleted successfully");
  }),

  // Get elderly statistics
  getElderlyStats: errorWrapper(async (req, res) => {
    const stats = await elderlyService.getElderlyStats();
    return successResponse(
      res,
      stats,
      "Elderly statistics fetched successfully"
    );
  }),
};

export default elderlyController;
