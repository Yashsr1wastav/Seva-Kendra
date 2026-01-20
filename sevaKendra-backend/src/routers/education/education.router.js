import { Router } from "express";
const router = Router();

// Import education sub-routers
import studyCenterRouter from "./studyCenter.router.js";
import scStudentRouter from "./scStudent.router.js";
import dropoutRouter from "./dropout.router.js";
import schoolRouter from "./school.router.js";
import competitiveExamRouter from "./competitiveExam.router.js";
import boardPreparationRouter from "./boardPreparation.router.js";
import teacherRouter from "./teacher.router.js";
import groupLeaderRouter from "./groupLeader.router.js";

// Education routes
router.use("/study-centers", studyCenterRouter);
router.use("/sc-students", scStudentRouter);
router.use("/dropouts", dropoutRouter);
router.use("/schools", schoolRouter);
router.use("/competitive-exams", competitiveExamRouter);
router.use("/board-preparations", boardPreparationRouter);
router.use("/teachers", teacherRouter);
router.use("/group-leaders", groupLeaderRouter);

export default router;
