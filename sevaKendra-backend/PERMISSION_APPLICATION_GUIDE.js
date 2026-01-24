/**
 * Bulk Permission Middleware Application Guide
 * 
 * This guide helps apply permission middleware to all remaining routers
 * 
 * PATTERN TO APPLY:
 * 
 * 1. Import the middleware:
 *    import { checkPermission } from "../../middleware/permissionMiddleware.js";
 * 
 * 2. Add to routes based on action:
 *    - GET routes (list, stats, filter, getById): checkPermission("MODULE", "view")
 *    - POST routes (create): checkPermission("MODULE", "create")
 *    - PUT/PATCH routes (update): checkPermission("MODULE", "edit")
 *    - DELETE routes: checkPermission("MODULE", "delete")
 * 
 * 3. Place AFTER verifyTokenExists, BEFORE controller
 * 
 * MODULES:
 * - health: All routes in sevaKendra-backend/src/routers/health/*.router.js
 * - education: All routes in sevaKendra-backend/src/routers/education/*.router.js
 * - socialJustice: All routes in sevaKendra-backend/src/routers/socialJustice/*.router.js
 */

// ============================================================================
// HEALTH MODULE ROUTERS
// ============================================================================

const healthRouters = [
  'addiction.router.js',
  'adolescents.router.js',
  'elderly.router.js',
  'healthCamp.router.js',      // ✅ DONE
  'hiv.router.js',
  'leprosy.router.js',
  'motherChild.router.js',
  'otherDiseases.router.js',
  'pwd.router.js',
  'tbhivAddict.router.js',
  'tuberculosis.router.js'
];

// Example for health routes:
const healthExample = `
import { checkPermission } from "../../middleware/permissionMiddleware.js";

// GET routes - viewing data
router.get("/", verifyTokenExists, checkPermission("health", "view"), controller.getAll);
router.get("/stats", verifyTokenExists, checkPermission("health", "view"), controller.getStats);
router.get("/:id", verifyTokenExists, checkPermission("health", "view"), controller.getById);

// POST routes - creating data
router.post("/", verifyTokenExists, checkPermission("health", "create"), createAutoFollowUp(...), controller.create);

// PUT routes - updating data
router.put("/:id", verifyTokenExists, checkPermission("health", "edit"), controller.update);

// DELETE routes - deleting data
router.delete("/:id", verifyTokenExists, checkPermission("health", "delete"), controller.delete);
`;

// ============================================================================
// EDUCATION MODULE ROUTERS
// ============================================================================

const educationRouters = [
  'boardPreparation.router.js',
  'competitiveExam.router.js',
  'dropout.router.js',
  'groupLeader.router.js',
  'school.router.js',
  'scStudent.router.js',
  'studyCenter.router.js',     // ✅ DONE
  'teacher.router.js'
];

// Example for education routes:
const educationExample = `
import { checkPermission } from "../../middleware/permissionMiddleware.js";

// GET routes - viewing data
router.get("/", verifyTokenExists, checkPermission("education", "view"), controller.getAll);
router.get("/stats", verifyTokenExists, checkPermission("education", "view"), controller.getStats);
router.get("/filter-options", verifyTokenExists, checkPermission("education", "view"), controller.getFilterOptions);
router.get("/:id", verifyTokenExists, checkPermission("education", "view"), controller.getById);

// POST routes - creating data
router.post("/", verifyTokenExists, checkPermission("education", "create"), createAutoFollowUp(...), controller.create);

// PUT routes - updating data
router.put("/:id", verifyTokenExists, checkPermission("education", "edit"), controller.update);

// DELETE routes - deleting data
router.delete("/:id", verifyTokenExists, checkPermission("education", "delete"), controller.delete);
`;

// ============================================================================
// SOCIAL JUSTICE MODULE ROUTERS
// ============================================================================

const socialJusticeRouters = [
  'cbucboDetails.router.js',        // ✅ DONE
  'entitlements.router.js',
  'legalAidService.router.js',
  'workshopsAwareness.router.js'
];

// Example for social justice routes:
const socialJusticeExample = `
import { checkPermission } from "../../middleware/permissionMiddleware.js";

// GET routes - viewing data
router.get("/", verifyTokenExists, checkPermission("socialJustice", "view"), controller.getAll);
router.get("/stats", verifyTokenExists, checkPermission("socialJustice", "view"), controller.getStats);
router.get("/:id", verifyTokenExists, checkPermission("socialJustice", "view"), controller.getById);

// POST routes - creating data
router.post("/", verifyTokenExists, checkPermission("socialJustice", "create"), createAutoFollowUp(...), controller.create);

// PUT routes - updating data
router.put("/:id", verifyTokenExists, checkPermission("socialJustice", "edit"), controller.update);

// DELETE routes - deleting data
router.delete("/:id", verifyTokenExists, checkPermission("socialJustice", "delete"), controller.delete);
`;

// ============================================================================
// SPECIAL CASES
// ============================================================================

// Reports endpoints (usually view and export only):
const reportsExample = `
import { checkPermission } from "../../middleware/permissionMiddleware.js";

router.get("/", verifyTokenExists, checkPermission("reports", "view"), controller.getReports);
router.post("/export", verifyTokenExists, checkPermission("reports", "export"), controller.exportReport);
`;

// Tracking endpoints (special permissions):
const trackingExample = `
// Tracking can use any module permission since it's cross-cutting
router.get("/", verifyTokenExists, checkAnyPermission([
  ["health", "view"],
  ["education", "view"],
  ["socialJustice", "view"]
]), controller.getTracking);
`;

// ============================================================================
// QUICK REFERENCE TABLE
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════════════╗
║                    PERMISSION MIDDLEWARE QUICK REFERENCE                  ║
╠══════════════════════════════════════════════════════════════════════════╣
║ HTTP Method  │ Action Type    │ Permission Action                        ║
╠──────────────┼────────────────┼──────────────────────────────────────────╣
║ GET          │ List/View      │ checkPermission("module", "view")        ║
║ GET          │ Stats          │ checkPermission("module", "view")        ║
║ GET          │ By ID          │ checkPermission("module", "view")        ║
║ POST         │ Create         │ checkPermission("module", "create")      ║
║ PUT/PATCH    │ Update         │ checkPermission("module", "edit")        ║
║ DELETE       │ Delete         │ checkPermission("module", "delete")      ║
║ POST         │ Export         │ checkPermission("module", "export")      ║
╚══════════════════════════════════════════════════════════════════════════╝

MODULES: health, education, socialJustice, users, reports

MIDDLEWARE ORDER:
1. verifyTokenExists         (validates JWT token)
2. checkPermission(...)       (validates permission)
3. createAutoFollowUp(...)    (creates follow-up if applicable)
4. controller method          (handles request)

COMPLETED:
✅ sevaKendra-backend/src/routers/health/healthCamp.router.js
✅ sevaKendra-backend/src/routers/education/studyCenter.router.js
✅ sevaKendra-backend/src/routers/socialJustice/cbucboDetails.router.js

REMAINING (${healthRouters.length - 1 + educationRouters.length - 1 + socialJusticeRouters.length - 1} files):
Health: ${healthRouters.filter(f => f !== 'healthCamp.router.js').join(', ')}
Education: ${educationRouters.filter(f => f !== 'studyCenter.router.js').join(', ')}
Social Justice: ${socialJusticeRouters.filter(f => f !== 'cbucboDetails.router.js').join(', ')}
`);

module.exports = {
  healthRouters,
  educationRouters,
  socialJusticeRouters
};
