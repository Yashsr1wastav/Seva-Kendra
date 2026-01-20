import { Router } from "express";
const router = Router();

// Import health sub-routers
import healthCampRouter from "./healthCamp.router.js";
import elderlyRouter from "./elderly.router.js";
import motherChildRouter from "./motherChild.router.js";
import pwdRouter from "./pwd.router.js";
import adolescentsRouter from "./adolescents.router.js";
import tuberculosisRouter from "./tuberculosis.router.js";
import hivRouter from "./hiv.router.js";
import leprosyRouter from "./leprosy.router.js";
import addictionRouter from "./addiction.router.js";
import otherDiseasesRouter from "./otherDiseases.router.js";

// Health routes
router.use("/health-camps", healthCampRouter);
router.use("/elderly", elderlyRouter);
router.use("/mother-child", motherChildRouter);
router.use("/pwd", pwdRouter);
router.use("/adolescents", adolescentsRouter);
router.use("/tuberculosis", tuberculosisRouter);
router.use("/hiv", hivRouter);
router.use("/leprosy", leprosyRouter);
router.use("/addiction", addictionRouter);
router.use("/other-diseases", otherDiseasesRouter);

export default router;
