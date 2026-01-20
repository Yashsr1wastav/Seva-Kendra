import { Router } from "express";
import { healthCheck } from "../controllers/app.controller.js";

// Import all routers
import authRouter from "./auth/auth.router.js";
import userRouter from "./user/user.router.js";
import educationRouter from "./education/education.router.js";
import healthRouter from "./health/health.router.js";
import socialJusticeRouter from "./socialJustice/socialJustice.router.js";
import trackingRouter from "../modules/tracking/tracking.router.js";

const router = Router();

// Health check
router.get("/", healthCheck);

// Authentication routes
router.use("/auth", authRouter);

// User management routes
router.use("/users", userRouter);

// Education module routes
router.use("/education", educationRouter);

// Health module routes
router.use("/health", healthRouter);

// Social Justice module routes
router.use("/social-justice", socialJusticeRouter);

// Tracking/Follow-up routes
router.use("/tracking", trackingRouter);

export default router;
