import hivService from "../services/hiv.service.js";
import { successResponse } from "../../../utils/response.utils.js";

class HIVController {
  async createHIV(req, res, next) {
    try {
      const hiv = await hivService.createHIV(req.body, req.user._id);
      return successResponse(res, hiv, "HIV record created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllHIV(req, res, next) {
    try {
      const filters = {
        name: req.query.name,
        gender: req.query.gender,
        wardNo: req.query.wardNo,
        habitation: req.query.habitation,
        householdCode: req.query.householdCode,
        hivStage: req.query.hivStage,
        statusOfTreatment: req.query.statusOfTreatment,
        overallStatus: req.query.overallStatus,
        projectResponsible: req.query.projectResponsible,
      };

      const pagination = {
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await hivService.getAllHIV(filters, pagination);
      return successResponse(res, result, "HIV records retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getHIVById(req, res, next) {
    try {
      const hiv = await hivService.getHIVById(req.params.id);
      return successResponse(res, hiv, "HIV record retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateHIV(req, res, next) {
    try {
      const hiv = await hivService.updateHIV(
        req.params.id,
        req.body,
        req.user._id
      );
      return successResponse(res, hiv, "HIV record updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteHIV(req, res, next) {
    try {
      await hivService.deleteHIV(req.params.id);
      return successResponse(res, null, "HIV record deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async getHIVStats(req, res, next) {
    try {
      const stats = await hivService.getHIVStats();
      return successResponse(
        res,
        stats,
        "HIV statistics retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new HIVController();
