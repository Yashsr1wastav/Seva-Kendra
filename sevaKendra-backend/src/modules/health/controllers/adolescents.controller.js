import * as adolescentsService from "../services/adolescents.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const adolescentsController = {
  // Get all adolescent records
  getAllAdolescents: errorWrapper(async (req, res) => {
    const result = await adolescentsService.getAllAdolescents(req.query);
    return successResponse(
      res,
      result,
      "Adolescent records fetched successfully"
    );
  }),

  // Get adolescent record by ID
  getAdolescentById: errorWrapper(async (req, res) => {
    const adolescent = await adolescentsService.getAdolescentById(
      req.params.id
    );
    return successResponse(
      res,
      adolescent,
      "Adolescent record fetched successfully"
    );
  }),

  // Create new adolescent record
  createAdolescent: errorWrapper(async (req, res) => {
    const adolescent = await adolescentsService.createAdolescent(
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      adolescent,
      "Adolescent record created successfully",
      201
    );
  }),

  // Update adolescent record
  updateAdolescent: errorWrapper(async (req, res) => {
    const adolescent = await adolescentsService.updateAdolescent(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      adolescent,
      "Adolescent record updated successfully"
    );
  }),

  // Delete adolescent record
  deleteAdolescent: errorWrapper(async (req, res) => {
    await adolescentsService.deleteAdolescent(req.params.id);
    return successResponse(res, null, "Adolescent record deleted successfully");
  }),

  // Get adolescent statistics
  getAdolescentStats: errorWrapper(async (req, res) => {
    const stats = await adolescentsService.getAdolescentStats();
    return successResponse(
      res,
      stats,
      "Adolescent statistics fetched successfully"
    );
  }),
};

export default adolescentsController;
