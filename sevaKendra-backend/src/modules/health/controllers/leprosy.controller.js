import leprosyService from "../services/leprosy.service.js";
import { successResponse } from "../../../utils/response.utils.js";

class LeprosyController {
  async createLeprosy(req, res, next) {
    try {
      const leprosy = await leprosyService.createLeprosy(
        req.body,
        req.user._id
      );
      return successResponse(
        res,
        leprosy,
        "Leprosy record created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllLeprosy(req, res, next) {
    try {
      const filters = {
        name: req.query.name,
        gender: req.query.gender,
        wardNo: req.query.wardNo,
        habitation: req.query.habitation,
        householdCode: req.query.householdCode,
        typeOfLeprosy: req.query.typeOfLeprosy,
        statusOfTreatment: req.query.statusOfTreatment,
        overallStatus: req.query.overallStatus,
        projectResponsible: req.query.projectResponsible,
      };

      const pagination = {
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await leprosyService.getAllLeprosy(filters, pagination);
      return successResponse(
        res,
        result,
        "Leprosy records retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getLeprosyById(req, res, next) {
    try {
      const leprosy = await leprosyService.getLeprosyById(req.params.id);
      return successResponse(
        res,
        leprosy,
        "Leprosy record retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateLeprosy(req, res, next) {
    try {
      const leprosy = await leprosyService.updateLeprosy(
        req.params.id,
        req.body,
        req.user._id
      );
      return successResponse(
        res,
        leprosy,
        "Leprosy record updated successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteLeprosy(req, res, next) {
    try {
      await leprosyService.deleteLeprosy(req.params.id);
      return successResponse(res, null, "Leprosy record deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async getLeprosyStats(req, res, next) {
    try {
      const stats = await leprosyService.getLeprosyStats();
      return successResponse(
        res,
        stats,
        "Leprosy statistics retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new LeprosyController();
