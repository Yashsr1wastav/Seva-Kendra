import trackingService from "./tracking.service.js";

class TrackingController {
  // Create new tracking record
  async createTracking(req, res) {
    try {
      const trackingData = {
        ...req.body,
        createdBy: req.user._id || req.user.id, // From auth middleware
      };

      const tracking = await trackingService.createTracking(trackingData);

      res.status(201).json({
        success: true,
        message: "Follow-up tracking created successfully",
        data: tracking,
      });
    } catch (error) {
      console.error("Error creating tracking:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create tracking record",
      });
    }
  }

  // Get all tracking records with filters
  async getAllTracking(req, res) {
    try {
      const filters = {
        recordType: req.query.recordType,
        module: req.query.module,
        status: req.query.status,
        priority: req.query.priority,
        assignedTo: req.query.assignedTo,
        createdBy: req.query.createdBy,
        wardNo: req.query.wardNo,
        habitation: req.query.habitation,
        projectResponsible: req.query.projectResponsible,
        followUpDateFrom: req.query.followUpDateFrom,
        followUpDateTo: req.query.followUpDateTo,
        isOverdue: req.query.isOverdue,
        search: req.query.search,
      };

      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: req.query.sort || "-followUpDate",
        populate: req.query.populate !== "false", // Default to true unless explicitly false
      };

      const result = await trackingService.getAllTracking(filters, options);

      res.status(200).json({
        success: true,
        data: result.trackings,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching tracking records:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch tracking records",
      });
    }
  }

  // Get tracking by ID
  async getTrackingById(req, res) {
    try {
      const tracking = await trackingService.getTrackingById(req.params.id);

      if (!tracking) {
        return res.status(404).json({
          success: false,
          message: "Tracking record not found",
        });
      }

      res.status(200).json({
        success: true,
        data: tracking,
      });
    } catch (error) {
      console.error("Error fetching tracking:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch tracking record",
      });
    }
  }

  // Get tracking records for a specific record
  async getTrackingByRecord(req, res) {
    try {
      const { recordType, recordId } = req.params;

      const trackings = await trackingService.getTrackingByRecord(
        recordType,
        recordId
      );

      res.status(200).json({
        success: true,
        data: trackings,
      });
    } catch (error) {
      console.error("Error fetching tracking by record:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch tracking records",
      });
    }
  }

  // Update tracking record
  async updateTracking(req, res) {
    try {
      const tracking = await trackingService.updateTracking(
        req.params.id,
        req.body
      );

      if (!tracking) {
        return res.status(404).json({
          success: false,
          message: "Tracking record not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Tracking record updated successfully",
        data: tracking,
      });
    } catch (error) {
      console.error("Error updating tracking:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update tracking record",
      });
    }
  }

  // Add monthly update
  async addMonthlyUpdate(req, res) {
    try {
      const updateData = {
        ...req.body,
        updatedBy: req.user._id || req.user.id,
      };

      const tracking = await trackingService.addMonthlyUpdate(
        req.params.id,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Monthly update added successfully",
        data: tracking,
      });
    } catch (error) {
      console.error("Error adding monthly update:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to add monthly update",
      });
    }
  }

  // Complete tracking
  async completeTracking(req, res) {
    try {
      const { notes } = req.body;
      const tracking = await trackingService.completeTracking(
        req.params.id,
        notes,
        req.user._id || req.user.id
      );

      res.status(200).json({
        success: true,
        message: "Follow-up marked as completed",
        data: tracking,
      });
    } catch (error) {
      console.error("Error completing tracking:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to complete tracking record",
      });
    }
  }

  // Cancel tracking
  async cancelTracking(req, res) {
    try {
      const { reason } = req.body;
      const tracking = await trackingService.cancelTracking(
        req.params.id,
        reason,
        req.user._id || req.user.id
      );

      res.status(200).json({
        success: true,
        message: "Follow-up cancelled successfully",
        data: tracking,
      });
    } catch (error) {
      console.error("Error cancelling tracking:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to cancel tracking record",
      });
    }
  }

  // Delete tracking
  async deleteTracking(req, res) {
    try {
      const tracking = await trackingService.deleteTracking(req.params.id);

      if (!tracking) {
        return res.status(404).json({
          success: false,
          message: "Tracking record not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Tracking record deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting tracking:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete tracking record",
      });
    }
  }

  // Get overdue follow-ups
  async getOverdueTracking(req, res) {
    try {
      const trackings = await trackingService.getOverdueTracking();

      res.status(200).json({
        success: true,
        data: trackings,
        count: trackings.length,
      });
    } catch (error) {
      console.error("Error fetching overdue tracking:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch overdue tracking records",
      });
    }
  }

  // Get upcoming follow-ups
  async getUpcomingTracking(req, res) {
    try {
      const days = parseInt(req.query.days) || 7;
      const trackings = await trackingService.getUpcomingTracking(days);

      res.status(200).json({
        success: true,
        data: trackings,
        count: trackings.length,
      });
    } catch (error) {
      console.error("Error fetching upcoming tracking:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch upcoming tracking records",
      });
    }
  }

  // Get tracking statistics
  async getTrackingStats(req, res) {
    try {
      const filters = {
        module: req.query.module,
        assignedTo: req.query.assignedTo,
        recordType: req.query.recordType,
      };

      console.log("Fetching stats with filters:", filters);
      const stats = await trackingService.getTrackingStats(filters);
      console.log("Stats calculated:", stats);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching tracking stats:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch tracking statistics",
      });
    }
  }

  // Get monthly update history for a record
  async getMonthlyUpdateHistory(req, res) {
    try {
      const { recordType, recordId } = req.params;

      const updates = await trackingService.getMonthlyUpdateHistory(
        recordType,
        recordId
      );

      res.status(200).json({
        success: true,
        data: updates,
      });
    } catch (error) {
      console.error("Error fetching monthly update history:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch monthly update history",
      });
    }
  }
}

export default new TrackingController();
