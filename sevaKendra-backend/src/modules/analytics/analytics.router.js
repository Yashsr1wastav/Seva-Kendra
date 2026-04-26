import express from "express";
import analyticsController from "./analytics.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All analytics routes require authentication
router.use(verifyTokenExists);

// Get complete dashboard data (all endpoints combined)
router.get("/dashboard", analyticsController.getCompleteDashboard);

// Individual analytics endpoints
router.get("/overview", analyticsController.getDashboardOverview);
router.get("/monthly-trends", analyticsController.getMonthlyTrends);
router.get("/gender-distribution", analyticsController.getGenderDistribution);
router.get("/age-distribution", analyticsController.getAgeDistribution);
router.get("/module-distribution", analyticsController.getModuleDistribution);
router.get("/status-distribution", analyticsController.getStatusDistribution);
router.get("/recent-activities", analyticsController.getRecentActivities);
router.get("/quick-insights", analyticsController.getQuickInsights);

export default router;
