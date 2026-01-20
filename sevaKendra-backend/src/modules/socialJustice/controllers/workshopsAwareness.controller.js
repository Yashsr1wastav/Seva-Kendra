import workshopsAwarenessService from "../services/workshopsAwareness.service.js";
import { errorWrapper } from "../../../middleware/errorWrapper.js";
import { successResponse } from "../../../utils/response.utils.js";

/**
 * Create a new Workshops & Awareness record
 */
export const createWorkshopsAwareness = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.createWorkshopsAwareness(
    req.body,
    req.user._id
  );
  successResponse(
    res,
    workshop,
    "Workshops & awareness record created successfully"
  );
});

/**
 * Get all Workshops & Awareness records with pagination and filtering
 */
export const getAllWorkshopsAwareness = errorWrapper(async (req, res) => {
  const filters = {
    wardNo: req.query.wardNo,
    habitation: req.query.habitation,
    groupType: req.query.groupType,
    trainingCategory: req.query.trainingCategory,
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

  const result = await workshopsAwarenessService.getAllWorkshopsAwareness(
    filters,
    options
  );
  successResponse(
    res,
    result,
    "Workshops & awareness records fetched successfully"
  );
});

/**
 * Get a single Workshops & Awareness record by ID
 */
export const getWorkshopsAwarenessById = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.getWorkshopsAwarenessById(
    req.params.id
  );
  successResponse(
    res,
    workshop,
    "Workshops & awareness record fetched successfully"
  );
});

/**
 * Update a Workshops & Awareness record
 */
export const updateWorkshopsAwareness = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.updateWorkshopsAwareness(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(
    res,
    workshop,
    "Workshops & awareness record updated successfully"
  );
});

/**
 * Delete a Workshops & Awareness record
 */
export const deleteWorkshopsAwareness = errorWrapper(async (req, res) => {
  const result = await workshopsAwarenessService.deleteWorkshopsAwareness(
    req.params.id
  );
  successResponse(
    res,
    result,
    "Workshops & awareness record deleted successfully"
  );
});

/**
 * Get Workshops & Awareness statistics
 */
export const getWorkshopsAwarenessStats = errorWrapper(async (req, res) => {
  const stats = await workshopsAwarenessService.getWorkshopsAwarenessStats();
  successResponse(
    res,
    stats,
    "Workshops & awareness statistics fetched successfully"
  );
});

/**
 * Get Workshops & Awareness by ward
 */
export const getWorkshopsAwarenessByWard = errorWrapper(async (req, res) => {
  const workshops = await workshopsAwarenessService.getWorkshopsAwarenessByWard(
    req.params.wardNo
  );
  successResponse(
    res,
    workshops,
    "Workshops & awareness by ward fetched successfully"
  );
});

/**
 * Get Workshops & Awareness by habitation
 */
export const getWorkshopsAwarenessByHabitation = errorWrapper(
  async (req, res) => {
    const workshops =
      await workshopsAwarenessService.getWorkshopsAwarenessByHabitation(
        req.params.habitation
      );
    successResponse(
      res,
      workshops,
      "Workshops & awareness by habitation fetched successfully"
    );
  }
);

/**
 * Get Workshops & Awareness by group type
 */
export const getWorkshopsAwarenessByGroupType = errorWrapper(
  async (req, res) => {
    const workshops =
      await workshopsAwarenessService.getWorkshopsAwarenessByGroupType(
        req.params.groupType
      );
    successResponse(
      res,
      workshops,
      "Workshops & awareness by group type fetched successfully"
    );
  }
);

/**
 * Get Workshops & Awareness by training category
 */
export const getWorkshopsAwarenessByCategory = errorWrapper(
  async (req, res) => {
    const workshops =
      await workshopsAwarenessService.getWorkshopsAwarenessByCategory(
        req.params.trainingCategory
      );
    successResponse(
      res,
      workshops,
      "Workshops & awareness by category fetched successfully"
    );
  }
);

/**
 * Add participant to workshop
 */
export const addParticipant = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.addParticipant(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, workshop, "Participant added successfully");
});

/**
 * Update participant attendance
 */
export const updateParticipantAttendance = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.updateParticipantAttendance(
    req.params.id,
    req.params.participantId,
    req.body.attendance,
    req.user._id
  );
  successResponse(res, workshop, "Participant attendance updated successfully");
});

/**
 * Add learning objective
 */
export const addLearningObjective = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.addLearningObjective(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, workshop, "Learning objective added successfully");
});

/**
 * Update learning objective achievement
 */
export const updateLearningObjective = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.updateLearningObjective(
    req.params.id,
    req.params.objectiveId,
    req.body.achieved,
    req.body.remarks,
    req.user._id
  );
  successResponse(res, workshop, "Learning objective updated successfully");
});

/**
 * Add follow-up action
 */
export const addFollowUpAction = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.addFollowUpAction(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, workshop, "Follow-up action added successfully");
});

/**
 * Update follow-up action status
 */
export const updateFollowUpActionStatus = errorWrapper(async (req, res) => {
  const workshop = await workshopsAwarenessService.updateFollowUpActionStatus(
    req.params.id,
    req.params.actionId,
    req.body.status,
    req.user._id
  );
  successResponse(
    res,
    workshop,
    "Follow-up action status updated successfully"
  );
});

/**
 * Get workshops requiring follow-up
 */
export const getWorkshopsRequiringFollowUp = errorWrapper(async (req, res) => {
  const workshops =
    await workshopsAwarenessService.getWorkshopsRequiringFollowUp();
  successResponse(
    res,
    workshops,
    "Workshops requiring follow-up fetched successfully"
  );
});

/**
 * Generate training effectiveness report
 */
export const generateEffectivenessReport = errorWrapper(async (req, res) => {
  const filters = {
    wardNo: req.query.wardNo,
    trainingCategory: req.query.trainingCategory,
    dateFrom: req.query.dateFrom,
    dateTo: req.query.dateTo,
  };

  const report = await workshopsAwarenessService.generateEffectivenessReport(
    filters
  );
  successResponse(
    res,
    report,
    "Training effectiveness report generated successfully"
  );
});

/**
 * Get upcoming workshops
 */
export const getUpcomingWorkshops = errorWrapper(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const workshops = await workshopsAwarenessService.getUpcomingWorkshops(days);
  successResponse(res, workshops, "Upcoming workshops fetched successfully");
});
