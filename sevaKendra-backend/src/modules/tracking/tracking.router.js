import express from "express";
import trackingController from "./tracking.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyTokenExists);

// Create new tracking record
router.post("/", trackingController.createTracking);

// Get all tracking records with filters
router.get("/", trackingController.getAllTracking);

// Get tracking statistics
router.get("/stats", trackingController.getTrackingStats);

// Get overdue follow-ups
router.get("/overdue", trackingController.getOverdueTracking);

// Get upcoming follow-ups
router.get("/upcoming", trackingController.getUpcomingTracking);

// Get tracking records for a specific record
router.get(
  "/record/:recordType/:recordId",
  trackingController.getTrackingByRecord
);

// Get monthly update history for a record
router.get(
  "/history/:recordType/:recordId",
  trackingController.getMonthlyUpdateHistory
);

// Get tracking by ID
router.get("/:id", trackingController.getTrackingById);

// Update tracking record
router.patch("/:id", trackingController.updateTracking);

// Add monthly update
router.post("/:id/monthly-update", trackingController.addMonthlyUpdate);

// Complete tracking
router.post("/:id/complete", trackingController.completeTracking);

// Cancel tracking
router.post("/:id/cancel", trackingController.cancelTracking);

// Delete tracking record (soft delete)
router.delete("/:id", trackingController.deleteTracking);

export default router;
