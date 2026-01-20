import * as tbhivAddictService from "../services/tbhivAddict.service.js";
import { successResponse } from "../../../utils/response.utils.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";

const tbhivAddictController = {
  // Get all TB/HIV/Addict records
  getAllTBHIVAddict: errorWrapper(async (req, res) => {
    const result = await tbhivAddictService.getAllTBHIVAddict(req.query);
    return successResponse(
      res,
      result,
      "TB/HIV/Addict records fetched successfully"
    );
  }),

  // Get TB/HIV/Addict record by ID
  getTBHIVAddictById: errorWrapper(async (req, res) => {
    const tbhivAddict = await tbhivAddictService.getTBHIVAddictById(
      req.params.id
    );
    return successResponse(
      res,
      tbhivAddict,
      "TB/HIV/Addict record fetched successfully"
    );
  }),

  // Create new TB/HIV/Addict record
  createTBHIVAddict: errorWrapper(async (req, res) => {
    const tbhivAddict = await tbhivAddictService.createTBHIVAddict(
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      tbhivAddict,
      "TB/HIV/Addict record created successfully",
      201
    );
  }),

  // Update TB/HIV/Addict record
  updateTBHIVAddict: errorWrapper(async (req, res) => {
    const tbhivAddict = await tbhivAddictService.updateTBHIVAddict(
      req.params.id,
      req.body,
      req.user.id
    );
    return successResponse(
      res,
      tbhivAddict,
      "TB/HIV/Addict record updated successfully"
    );
  }),

  // Delete TB/HIV/Addict record
  deleteTBHIVAddict: errorWrapper(async (req, res) => {
    await tbhivAddictService.deleteTBHIVAddict(req.params.id);
    return successResponse(
      res,
      null,
      "TB/HIV/Addict record deleted successfully"
    );
  }),

  // Get TB/HIV/Addict statistics
  getTBHIVAddictStats: errorWrapper(async (req, res) => {
    const stats = await tbhivAddictService.getTBHIVAddictStats();
    return successResponse(
      res,
      stats,
      "TB/HIV/Addict statistics fetched successfully"
    );
  }),
};

export default tbhivAddictController;
