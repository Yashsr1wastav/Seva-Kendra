import legalAidServiceService from "../services/legalAidService.service.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";
import { successResponse } from "../../../utils/response.utils.js";

/**
 * Create a new Legal Aid Service record
 */
export const createLegalAidService = errorWrapper(async (req, res) => {
  const legalAidService = await legalAidServiceService.createLegalAidService(
    req.body,
    req.user._id
  );
  successResponse(
    res,
    legalAidService,
    "Legal aid service record created successfully"
  );
});

/**
 * Get all Legal Aid Service records with pagination and filtering
 */
export const getAllLegalAidServices = errorWrapper(async (req, res) => {
  const filters = {
    wardNo: req.query.wardNo,
    habitation: req.query.habitation,
    caseType: req.query.caseType,
    caseStatus: req.query.caseStatus,
    priorityLevel: req.query.priorityLevel,
    projectResponsible: req.query.projectResponsible,
    dateFrom: req.query.dateFrom,
    dateTo: req.query.dateTo,
  };

  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc",
    search: req.query.search,
  };

  const result = await legalAidServiceService.getAllLegalAidServices(
    filters,
    options
  );
  successResponse(
    res,
    result,
    "Legal aid service records fetched successfully"
  );
});

/**
 * Get a single Legal Aid Service record by ID
 */
export const getLegalAidServiceById = errorWrapper(async (req, res) => {
  const legalAidService = await legalAidServiceService.getLegalAidServiceById(
    req.params.id
  );
  successResponse(
    res,
    legalAidService,
    "Legal aid service record fetched successfully"
  );
});

/**
 * Update a Legal Aid Service record
 */
export const updateLegalAidService = errorWrapper(async (req, res) => {
  const legalAidService = await legalAidServiceService.updateLegalAidService(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(
    res,
    legalAidService,
    "Legal aid service record updated successfully"
  );
});

/**
 * Delete a Legal Aid Service record
 */
export const deleteLegalAidService = errorWrapper(async (req, res) => {
  const result = await legalAidServiceService.deleteLegalAidService(
    req.params.id
  );
  successResponse(res, result, "Legal aid service record deleted successfully");
});

/**
 * Get Legal Aid Service statistics
 */
export const getLegalAidServiceStats = errorWrapper(async (req, res) => {
  const stats = await legalAidServiceService.getLegalAidServiceStats();
  successResponse(
    res,
    stats,
    "Legal aid service statistics fetched successfully"
  );
});

/**
 * Get Legal Aid Services by ward
 */
export const getLegalAidServicesByWard = errorWrapper(async (req, res) => {
  const legalAidServices =
    await legalAidServiceService.getLegalAidServicesByWard(req.params.wardNo);
  successResponse(
    res,
    legalAidServices,
    "Legal aid services by ward fetched successfully"
  );
});

/**
 * Get Legal Aid Services by habitation
 */
export const getLegalAidServicesByHabitation = errorWrapper(
  async (req, res) => {
    const legalAidServices =
      await legalAidServiceService.getLegalAidServicesByHabitation(
        req.params.habitation
      );
    successResponse(
      res,
      legalAidServices,
      "Legal aid services by habitation fetched successfully"
    );
  }
);

/**
 * Get Legal Aid Services by case type
 */
export const getLegalAidServicesByCaseType = errorWrapper(async (req, res) => {
  const legalAidServices =
    await legalAidServiceService.getLegalAidServicesByCaseType(
      req.params.caseType
    );
  successResponse(
    res,
    legalAidServices,
    "Legal aid services by case type fetched successfully"
  );
});

/**
 * Get Legal Aid Services by case status
 */
export const getLegalAidServicesByCaseStatus = errorWrapper(
  async (req, res) => {
    const legalAidServices =
      await legalAidServiceService.getLegalAidServicesByCaseStatus(
        req.params.caseStatus
      );
    successResponse(
      res,
      legalAidServices,
      "Legal aid services by case status fetched successfully"
    );
  }
);

/**
 * Get Legal Aid Services by priority level
 */
export const getLegalAidServicesByPriority = errorWrapper(async (req, res) => {
  const legalAidServices =
    await legalAidServiceService.getLegalAidServicesByPriority(
      req.params.priorityLevel
    );
  successResponse(
    res,
    legalAidServices,
    "Legal aid services by priority fetched successfully"
  );
});

/**
 * Add intervention step to legal aid case
 */
export const addInterventionStep = errorWrapper(async (req, res) => {
  const legalAidService = await legalAidServiceService.addInterventionStep(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, legalAidService, "Intervention step added successfully");
});

/**
 * Update intervention step
 */
export const updateInterventionStep = errorWrapper(async (req, res) => {
  const legalAidService = await legalAidServiceService.updateInterventionStep(
    req.params.id,
    req.params.stepId,
    req.body,
    req.user._id
  );
  successResponse(
    res,
    legalAidService,
    "Intervention step updated successfully"
  );
});

/**
 * Update case status
 */
export const updateCaseStatus = errorWrapper(async (req, res) => {
  const legalAidService = await legalAidServiceService.updateCaseStatus(
    req.params.id,
    req.body.caseStatus,
    req.user._id
  );
  successResponse(res, legalAidService, "Case status updated successfully");
});

/**
 * Get cases requiring follow-up
 */
export const getCasesRequiringFollowUp = errorWrapper(async (req, res) => {
  const cases = await legalAidServiceService.getCasesRequiringFollowUp();
  successResponse(res, cases, "Cases requiring follow-up fetched successfully");
});

/**
 * Get case timeline
 */
export const getCaseTimeline = errorWrapper(async (req, res) => {
  const timeline = await legalAidServiceService.getCaseTimeline(req.params.id);
  successResponse(res, timeline, "Case timeline fetched successfully");
});

/**
 * Generate case report
 */
export const generateCaseReport = errorWrapper(async (req, res) => {
  const filters = {
    wardNo: req.query.wardNo,
    caseType: req.query.caseType,
    caseStatus: req.query.caseStatus,
    dateFrom: req.query.dateFrom,
    dateTo: req.query.dateTo,
  };

  const report = await legalAidServiceService.generateCaseReport(filters);
  successResponse(res, report, "Case report generated successfully");
});
