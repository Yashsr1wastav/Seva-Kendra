import { Router } from "express";
import cbucboDetailsRouter from "./cbucboDetails.router.js";
import entitlementsRouter from "./entitlements.router.js";
import legalAidServiceRouter from "./legalAidService.router.js";
import workshopsAwarenessRouter from "./workshopsAwareness.router.js";

const router = Router();

// Social Justice sub-module routes
router.use("/cbucbo-details", cbucboDetailsRouter);
router.use("/entitlements", entitlementsRouter);
router.use("/legal-aid-service", legalAidServiceRouter);
router.use("/workshops-awareness", workshopsAwarenessRouter);

export default router;
