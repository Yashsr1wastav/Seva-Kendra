import express from "express";
import * as userController from "../../modules/user/user.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";
import { adminOnly } from "../../middleware/permissionMiddleware.js";

const router = express.Router();

// Protect all user management routes - require authentication
router.use(verifyTokenExists);

// Get current user profile (any authenticated user)
router.get("/profile", userController.getCurrentUser);

// Admin only routes
router.use(adminOnly);

// User statistics
router.get("/stats", userController.getUserStats);

// User CRUD operations
router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Permission management
router.put("/:id/permissions", userController.updateUserPermissions);

export default router;
