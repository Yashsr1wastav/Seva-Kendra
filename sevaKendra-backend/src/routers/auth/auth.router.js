import express from "express";
import * as authController from "../../modules/auth/auth.controller.js";

const router = express.Router();

// Authentication endpoints
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/dummy-login", authController.dummyLogin); // Development only
router.post("/logout", authController.logout);
router.get("/verify", authController.verifyToken);

export default router;
