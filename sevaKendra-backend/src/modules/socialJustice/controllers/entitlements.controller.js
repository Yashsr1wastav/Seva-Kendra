import entitlementsService from "../services/entitlements.service.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";
import { successResponse } from "../../../utils/response.utils.js";

/**
 * Create a new Entitlements record
 */
export const createEntitlements = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.createEntitlements(
    req.body,
    req.user._id
  );
  successResponse(
    res,
    entitlements,
    "Entitlements record created successfully"
  );
});

/**
 * Get all Entitlements records with pagination and filtering
 */
export const getAllEntitlements = errorWrapper(async (req, res) => {
  const filters = {
    wardNo: req.query.wardNo,
    habitation: req.query.habitation,
    idProofType: req.query.idProofType,
    applicationStatus: req.query.applicationStatus,
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

  const result = await entitlementsService.getAllEntitlements(filters, options);
  successResponse(res, result, "Entitlements records fetched successfully");
});

/**
 * Get a single Entitlements record by ID
 */
export const getEntitlementsById = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.getEntitlementsById(
    req.params.id
  );
  successResponse(
    res,
    entitlements,
    "Entitlements record fetched successfully"
  );
});

/**
 * Update an Entitlements record
 */
export const updateEntitlements = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.updateEntitlements(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(
    res,
    entitlements,
    "Entitlements record updated successfully"
  );
});

/**
 * Delete an Entitlements record
 */
export const deleteEntitlements = errorWrapper(async (req, res) => {
  const result = await entitlementsService.deleteEntitlements(req.params.id);
  successResponse(res, result, "Entitlements record deleted successfully");
});

/**
 * Get Entitlements statistics
 */
export const getEntitlementsStats = errorWrapper(async (req, res) => {
  const stats = await entitlementsService.getEntitlementsStats();
  successResponse(res, stats, "Entitlements statistics fetched successfully");
});

/**
 * Get Entitlements by ward
 */
export const getEntitlementsByWard = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.getEntitlementsByWard(
    req.params.wardNo
  );
  successResponse(
    res,
    entitlements,
    "Entitlements by ward fetched successfully"
  );
});

/**
 * Get Entitlements by habitation
 */
export const getEntitlementsByHabitation = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.getEntitlementsByHabitation(
    req.params.habitation
  );
  successResponse(
    res,
    entitlements,
    "Entitlements by habitation fetched successfully"
  );
});

/**
 * Get Entitlements by application status
 */
export const getEntitlementsByStatus = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.getEntitlementsByStatus(
    req.params.applicationStatus
  );
  successResponse(
    res,
    entitlements,
    "Entitlements by status fetched successfully"
  );
});

/**
 * Get Entitlements by ID proof type
 */
export const getEntitlementsByIdProofType = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.getEntitlementsByIdProofType(
    req.params.idProofType
  );
  successResponse(
    res,
    entitlements,
    "Entitlements by ID proof type fetched successfully"
  );
});

/**
 * Add eligible scheme to entitlements record
 */
export const addEligibleScheme = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.addEligibleScheme(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, entitlements, "Eligible scheme added successfully");
});

/**
 * Update eligible scheme status
 */
export const updateSchemeStatus = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.updateSchemeStatus(
    req.params.id,
    req.params.schemeId,
    req.body.status,
    req.user._id
  );
  successResponse(res, entitlements, "Scheme status updated successfully");
});

/**
 * Add progress report
 */
export const addProgressReport = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.addProgressReport(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, entitlements, "Progress report added successfully");
});

/**
 * Update progress report
 */
export const updateProgressReport = errorWrapper(async (req, res) => {
  const entitlements = await entitlementsService.updateProgressReport(
    req.params.id,
    req.params.reportId,
    req.body,
    req.user._id
  );
  successResponse(res, entitlements, "Progress report updated successfully");
});

/**
 * Get entitlements summary by scheme
 */
export const getEntitlementsByScheme = errorWrapper(async (req, res) => {
  const summary = await entitlementsService.getEntitlementsByScheme(
    req.params.schemeName
  );
  successResponse(res, summary, "Entitlements by scheme fetched successfully");
});
