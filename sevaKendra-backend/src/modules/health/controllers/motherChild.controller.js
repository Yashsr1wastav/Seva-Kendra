import * as motherChildService from "../services/motherChild.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const motherChildController = {
  // Get all mother child records
  getAllMotherChild: errorWrapper(async (req, res) => {
    const result = await motherChildService.getAllMotherChild(req.query);
    return successResponse(
      res,
      result,
      "Mother child records fetched successfully"
    );
  }),

  // Get mother child record by ID
  getMotherChildById: errorWrapper(async (req, res) => {
    const motherChild = await motherChildService.getMotherChildById(
      req.params.id
    );
    return successResponse(
      res,
      motherChild,
      "Mother child record fetched successfully"
    );
  }),

  // Create new mother child record
  createMotherChild: errorWrapper(async (req, res) => {
    const motherChild = await motherChildService.createMotherChild(
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      motherChild,
      "Mother child record created successfully",
      201
    );
  }),

  // Update mother child record
  updateMotherChild: errorWrapper(async (req, res) => {
    const motherChild = await motherChildService.updateMotherChild(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      motherChild,
      "Mother child record updated successfully"
    );
  }),

  // Delete mother child record
  deleteMotherChild: errorWrapper(async (req, res) => {
    await motherChildService.deleteMotherChild(req.params.id);
    return successResponse(
      res,
      null,
      "Mother child record deleted successfully"
    );
  }),

  // Get mother child statistics
  getMotherChildStats: errorWrapper(async (req, res) => {
    const stats = await motherChildService.getMotherChildStats();
    return successResponse(
      res,
      stats,
      "Mother child statistics fetched successfully"
    );
  }),
};

export default motherChildController;
