import cbucboDetailsService from "../services/cbucboDetails.service.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";
import { successResponse } from "../../../utils/response.utils.js";

/**
 * Create a new CBUCBO Details record
 */
export const createCBUCBODetails = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.createCBUCBODetails(
    req.body,
    req.user._id
  );
  successResponse(res, cbucboDetails, "CBUCBO details created successfully");
});

/**
 * Get all CBUCBO Details records with pagination and filtering
 */
export const getAllCBUCBODetails = errorWrapper(async (req, res) => {
  const filters = {
    wardNo: req.query.wardNo,
    habitation: req.query.habitation,
    groupType: req.query.groupType,
    status: req.query.status,
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

  const result = await cbucboDetailsService.getAllCBUCBODetails(
    filters,
    options
  );
  successResponse(res, result, "CBUCBO details fetched successfully");
});

/**
 * Get a single CBUCBO Details record by ID
 */
export const getCBUCBODetailsById = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.getCBUCBODetailsById(
    req.params.id
  );
  successResponse(res, cbucboDetails, "CBUCBO details fetched successfully");
});

/**
 * Update a CBUCBO Details record
 */
export const updateCBUCBODetails = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.updateCBUCBODetails(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, cbucboDetails, "CBUCBO details updated successfully");
});

/**
 * Delete a CBUCBO Details record
 */
export const deleteCBUCBODetails = errorWrapper(async (req, res) => {
  const result = await cbucboDetailsService.deleteCBUCBODetails(req.params.id);
  successResponse(res, result, "CBUCBO details deleted successfully");
});

/**
 * Get CBUCBO Details statistics
 */
export const getCBUCBODetailsStats = errorWrapper(async (req, res) => {
  const stats = await cbucboDetailsService.getCBUCBODetailsStats();
  successResponse(res, stats, "CBUCBO details statistics fetched successfully");
});

/**
 * Get CBUCBO Details by ward
 */
export const getCBUCBODetailsByWard = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.getCBUCBODetailsByWard(
    req.params.wardNo
  );
  successResponse(
    res,
    cbucboDetails,
    "CBUCBO details by ward fetched successfully"
  );
});

/**
 * Get CBUCBO Details by habitation
 */
export const getCBUCBODetailsByHabitation = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.getCBUCBODetailsByHabitation(
    req.params.habitation
  );
  successResponse(
    res,
    cbucboDetails,
    "CBUCBO details by habitation fetched successfully"
  );
});

/**
 * Get CBUCBO Details by group type
 */
export const getCBUCBODetailsByGroupType = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.getCBUCBODetailsByGroupType(
    req.params.groupType
  );
  successResponse(
    res,
    cbucboDetails,
    "CBUCBO details by group type fetched successfully"
  );
});

/**
 * Get CBUCBO Details by status
 */
export const getCBUCBODetailsByStatus = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.getCBUCBODetailsByStatus(
    req.params.status
  );
  successResponse(
    res,
    cbucboDetails,
    "CBUCBO details by status fetched successfully"
  );
});

/**
 * Update member details for a CBUCBO group
 */
export const updateMemberDetails = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.updateMemberDetails(
    req.params.id,
    req.body.memberDetails,
    req.user._id
  );
  successResponse(res, cbucboDetails, "Member details updated successfully");
});

/**
 * Add capacity building activity
 */
export const addCapacityBuildingActivity = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.addCapacityBuildingActivity(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(
    res,
    cbucboDetails,
    "Capacity building activity added successfully"
  );
});

/**
 * Update progress report
 */
export const updateProgressReport = errorWrapper(async (req, res) => {
  const cbucboDetails = await cbucboDetailsService.updateProgressReport(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, cbucboDetails, "Progress report updated successfully");
});
