import addictionService from "../services/addiction.service.js";
import { successResponse } from "../../../utils/response.utils.js";

class AddictionController {
  async createAddiction(req, res, next) {
    try {
      const addiction = await addictionService.createAddiction(
        req.body,
        req.user._id
      );
      return successResponse(
        res,
        addiction,
        "Addiction record created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllAddiction(req, res, next) {
    try {
      const filters = {
        caseId: req.query.caseId,
        name: req.query.name,
        gender: req.query.gender,
        wardNo: req.query.wardNo,
        habitation: req.query.habitation,
        typeOfSubstancesUsed: req.query.typeOfSubstancesUsed,
        statusOfLinkageWithSkillDevelopment:
          req.query.statusOfLinkageWithSkillDevelopment,
        overallStatus: req.query.overallStatus,
        projectResponsible: req.query.projectResponsible,
      };

      const pagination = {
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await addictionService.getAllAddiction(
        filters,
        pagination
      );
      return successResponse(
        res,
        result,
        "Addiction records retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getAddictionById(req, res, next) {
    try {
      const addiction = await addictionService.getAddictionById(req.params.id);
      return successResponse(
        res,
        addiction,
        "Addiction record retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateAddiction(req, res, next) {
    try {
      const addiction = await addictionService.updateAddiction(
        req.params.id,
        req.body,
        req.user._id
      );
      return successResponse(
        res,
        addiction,
        "Addiction record updated successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteAddiction(req, res, next) {
    try {
      await addictionService.deleteAddiction(req.params.id);
      return successResponse(
        res,
        null,
        "Addiction record deleted successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getAddictionStats(req, res, next) {
    try {
      const stats = await addictionService.getAddictionStats();
      return successResponse(
        res,
        stats,
        "Addiction statistics retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AddictionController();
