import express from "express";
import * as userController from "../../modules/user/user.controller.js";

const router = express.Router();

// User endpoints
router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
