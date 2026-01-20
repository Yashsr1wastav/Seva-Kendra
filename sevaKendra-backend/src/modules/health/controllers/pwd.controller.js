import * as pwdService from "../services/pwd.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const pwdController = {
  // Get all PWD records
  getAllPWD: errorWrapper(async (req, res) => {
    const result = await pwdService.getAllPWD(req.query);
    return successResponse(res, result, "PWD records fetched successfully");
  }),

  // Get PWD record by ID
  getPWDById: errorWrapper(async (req, res) => {
    const pwd = await pwdService.getPWDById(req.params.id);
    return successResponse(res, pwd, "PWD record fetched successfully");
  }),

  // Create new PWD record
  createPWD: errorWrapper(async (req, res) => {
    const pwd = await pwdService.createPWD(req.body, req.user.id);
    return successResponse(res, pwd, "PWD record created successfully", 201);
  }),

  // Update PWD record
  updatePWD: errorWrapper(async (req, res) => {
    const pwd = await pwdService.updatePWD(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(res, pwd, "PWD record updated successfully");
  }),

  // Delete PWD record
  deletePWD: errorWrapper(async (req, res) => {
    await pwdService.deletePWD(req.params.id);
    return successResponse(res, null, "PWD record deleted successfully");
  }),

  // Get PWD statistics
  getPWDStats: errorWrapper(async (req, res) => {
    const stats = await pwdService.getPWDStats();
    return successResponse(res, stats, "PWD statistics fetched successfully");
  }),
};

export default pwdController;
