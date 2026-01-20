import otherDiseasesService from "../services/otherDiseases.service.js";
import { successResponse } from "../../../utils/response.utils.js";

class OtherDiseasesController {
  async createOtherDiseases(req, res, next) {
    try {
      const otherDiseases = await otherDiseasesService.createOtherDiseases(
        req.body,
        req.user._id
      );
      return successResponse(
        res,
        otherDiseases,
        "Other Diseases record created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllOtherDiseases(req, res, next) {
    try {
      const filters = {
        name: req.query.name,
        gender: req.query.gender,
        wardNo: req.query.wardNo,
        habitation: req.query.habitation,
        natureOfIssue: req.query.natureOfIssue,
        overallStatus: req.query.overallStatus,
        projectResponsible: req.query.projectResponsible,
      };

      const pagination = {
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await otherDiseasesService.getAllOtherDiseases(
        filters,
        pagination
      );
      return successResponse(
        res,
        result,
        "Other Diseases records retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getOtherDiseasesById(req, res, next) {
    try {
      const otherDiseases = await otherDiseasesService.getOtherDiseasesById(
        req.params.id
      );
      return successResponse(
        res,
        otherDiseases,
        "Other Diseases record retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateOtherDiseases(req, res, next) {
    try {
      const otherDiseases = await otherDiseasesService.updateOtherDiseases(
        req.params.id,
        req.body,
        req.user._id
      );
      return successResponse(
        res,
        otherDiseases,
        "Other Diseases record updated successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteOtherDiseases(req, res, next) {
    try {
      await otherDiseasesService.deleteOtherDiseases(req.params.id);
      return successResponse(
        res,
        null,
        "Other Diseases record deleted successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getOtherDiseasesStats(req, res, next) {
    try {
      const stats = await otherDiseasesService.getOtherDiseasesStats();
      return successResponse(
        res,
        stats,
        "Other Diseases statistics retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new OtherDiseasesController();
