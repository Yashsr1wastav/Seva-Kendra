import { Router } from "express";
const router = Router();
import teacherController from "../../modules/education/controllers/teacher.controller.js";
import { verifyTokenExists } from "../../middleware/authMiddleware.js";

// Routes with authentication
router.get("/dropdown", verifyTokenExists, teacherController.getTeachersDropdown);
router.get("/stats", verifyTokenExists, teacherController.getTeachersStats);
router.get("/filter-options", verifyTokenExists, teacherController.getFilterOptions);
router.get("/", verifyTokenExists, teacherController.getAllTeachers);
router.get("/:id", verifyTokenExists, teacherController.getTeacherById);
router.post("/", verifyTokenExists, teacherController.createTeacher);
router.put("/:id", verifyTokenExists, teacherController.updateTeacher);
router.delete("/:id", verifyTokenExists, teacherController.deleteTeacher);

export default router;
