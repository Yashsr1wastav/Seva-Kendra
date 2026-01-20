import tuberculosisService from "../services/tuberculosis.service.js";
import { successResponse } from "../../../utils/response.utils.js";

class TuberculosisController {
  async createTuberculosis(req, res, next) {
    try {
      const tuberculosis = await tuberculosisService.createTuberculosis(
        req.body,
        req.user._id
      );
      return successResponse(
        res,
        tuberculosis,
        "Tuberculosis record created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllTuberculosis(req, res, next) {
    try {
      const filters = {
        nikshaiId: req.query.nikshaiId,
        name: req.query.name,
        gender: req.query.gender,
        wardNo: req.query.wardNo,
        habitation: req.query.habitation,
        typeOfTB: req.query.typeOfTB,
        overallStatus: req.query.overallStatus,
        projectResponsible: req.query.projectResponsible,
      };

      const pagination = {
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await tuberculosisService.getAllTuberculosis(
        filters,
        pagination
      );
      return successResponse(
        res,
        result,
        "Tuberculosis records retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getTuberculosisById(req, res, next) {
    try {
      const tuberculosis = await tuberculosisService.getTuberculosisById(
        req.params.id
      );
      return successResponse(
        res,
        tuberculosis,
        "Tuberculosis record retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateTuberculosis(req, res, next) {
    try {
      const tuberculosis = await tuberculosisService.updateTuberculosis(
        req.params.id,
        req.body,
        req.user._id
      );
      return successResponse(
        res,
        tuberculosis,
        "Tuberculosis record updated successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteTuberculosis(req, res, next) {
    try {
      await tuberculosisService.deleteTuberculosis(req.params.id);
      return successResponse(
        res,
        null,
        "Tuberculosis record deleted successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getTuberculosisStats(req, res, next) {
    try {
      const stats = await tuberculosisService.getTuberculosisStats();
      return successResponse(
        res,
        stats,
        "Tuberculosis statistics retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new TuberculosisController();
