import Tracking from "./tracking.model.js";
import mongoose from "mongoose";

class TrackingService {
  // Create new tracking record
  async createTracking(trackingData) {
    const tracking = new Tracking(trackingData);
    return await tracking.save();
  }

  // Get all tracking records with filters and pagination
  async getAllTracking(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = "-followUpDate",
      populate = true,
    } = options;

    const query = { isActive: true };

    // Apply filters
    if (filters.recordType) query.recordType = filters.recordType;
    if (filters.module) query.module = filters.module;
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.createdBy) query.createdBy = filters.createdBy;
    if (filters.wardNo) query.wardNo = filters.wardNo;
    if (filters.habitation) query.habitation = filters.habitation;
    if (filters.projectResponsible)
      query.projectResponsible = filters.projectResponsible;

    // Date range filters
    if (filters.followUpDateFrom || filters.followUpDateTo) {
      query.followUpDate = {};
      if (filters.followUpDateFrom)
        query.followUpDate.$gte = new Date(filters.followUpDateFrom);
      if (filters.followUpDateTo)
        query.followUpDate.$lte = new Date(filters.followUpDateTo);
    }

    // Overdue filter
    if (filters.isOverdue === "true" || filters.isOverdue === true) {
      query.isOverdue = true;
    }

    // Search by title or recordName
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { recordName: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    let queryBuilder = Tracking.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    if (populate) {
      queryBuilder = queryBuilder
        .populate("createdBy", "firstName lastName email")
        .populate("assignedTo", "firstName lastName email")
        .populate("monthlyUpdates.updatedBy", "firstName lastName");
    }

    const [trackings, total] = await Promise.all([
      queryBuilder.exec(),
      Tracking.countDocuments(query),
    ]);

    return {
      trackings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get tracking by ID
  async getTrackingById(id) {
    return await Tracking.findById(id)
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .populate("monthlyUpdates.updatedBy", "firstName lastName");
  }

  // Get all tracking records for a specific record
  async getTrackingByRecord(recordType, recordId) {
    return await Tracking.find({
      recordType,
      recordId: new mongoose.Types.ObjectId(recordId),
      isActive: true,
    })
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .sort("-followUpDate");
  }

  // Update tracking record
  async updateTracking(id, updateData) {
    const tracking = await Tracking.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    return tracking;
  }

  // Add monthly update to tracking record
  async addMonthlyUpdate(id, updateData) {
    const tracking = await Tracking.findById(id);
    if (!tracking) {
      throw new Error("Tracking record not found");
    }

    await tracking.addMonthlyUpdate(updateData);

    return await Tracking.findById(id)
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .populate("monthlyUpdates.updatedBy", "firstName lastName");
  }

  // Complete tracking record
  async completeTracking(id, notes, completedBy) {
    const tracking = await Tracking.findById(id);
    if (!tracking) {
      throw new Error("Tracking record not found");
    }

    await tracking.complete(notes, completedBy);

    return await Tracking.findById(id)
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");
  }

  // Cancel tracking record
  async cancelTracking(id, reason, cancelledBy) {
    return await this.updateTracking(id, {
      status: "Cancelled",
      isActive: false,
      completionNotes: reason,
      $push: {
        monthlyUpdates: {
          date: new Date(),
          notes: reason || "Follow-up cancelled",
          status: "Cancelled",
          updatedBy: cancelledBy,
        },
      },
    });
  }

  // Delete tracking record (soft delete)
  async deleteTracking(id) {
    return await Tracking.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }

  // Get overdue follow-ups
  async getOverdueTracking() {
    return await Tracking.getOverdue()
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");
  }

  // Get upcoming follow-ups
  async getUpcomingTracking(days = 7) {
    return await Tracking.getUpcoming(days)
      .populate("createdBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");
  }

  // Get tracking statistics
  async getTrackingStats(filters = {}) {
    const query = { isActive: true };
    const baseQuery = {}; // Query without isActive filter for completed stats

    // Apply filters if provided
    if (filters.module) {
      query.module = filters.module;
      baseQuery.module = filters.module;
    }
    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo;
      baseQuery.assignedTo = filters.assignedTo;
    }
    if (filters.recordType) {
      query.recordType = filters.recordType;
      baseQuery.recordType = filters.recordType;
    }

    // Get start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      total,
      pending,
      inProgress,
      completed,
      overdue,
      completedThisMonth,
      byModule,
      byPriority,
      byStatus,
    ] = await Promise.all([
      Tracking.countDocuments(query),
      Tracking.countDocuments({ ...query, status: "Pending" }),
      Tracking.countDocuments({ ...query, status: "In Progress" }),
      Tracking.countDocuments({ ...baseQuery, status: "Completed" }), // Use baseQuery to include inactive completed records
      Tracking.countDocuments({
        ...query,
        isOverdue: true,
        status: { $nin: ["Completed", "Cancelled"] },
      }),
      Tracking.countDocuments({
        ...baseQuery, // Use baseQuery to include inactive completed records
        status: "Completed",
        completedDate: { $gte: startOfMonth },
      }),
      Tracking.aggregate([
        { $match: query },
        { $group: { _id: "$module", count: { $sum: 1 } } },
      ]),
      Tracking.aggregate([
        { $match: query },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      Tracking.aggregate([
        { $match: query },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      completedThisMonth,
      byModule: byModule.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }

  // Get monthly update history for a record
  async getMonthlyUpdateHistory(recordType, recordId) {
    const trackings = await Tracking.find({
      recordType,
      recordId: new mongoose.Types.ObjectId(recordId),
    })
      .select("monthlyUpdates title")
      .populate("monthlyUpdates.updatedBy", "firstName lastName")
      .sort("-createdAt");

    const allUpdates = [];
    trackings.forEach((tracking) => {
      tracking.monthlyUpdates.forEach((update) => {
        allUpdates.push({
          ...update.toObject(),
          trackingTitle: tracking.title,
          trackingId: tracking._id,
        });
      });
    });

    // Sort by date descending
    allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));

    return allUpdates;
  }

  // Bulk update overdue status (can be run as a cron job)
  async updateOverdueStatus() {
    const now = new Date();
    await Tracking.updateMany(
      {
        isActive: true,
        status: { $nin: ["Completed", "Cancelled"] },
        followUpDate: { $lt: now },
        isOverdue: false,
      },
      { $set: { isOverdue: true } }
    );
  }
}

export default new TrackingService();
