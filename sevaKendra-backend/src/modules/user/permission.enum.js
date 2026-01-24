// Permission modules
export const PermissionModule = Object.freeze({
  HEALTH: "health",
  EDUCATION: "education",
  SOCIAL_JUSTICE: "socialJustice",
  USERS: "users",
  REPORTS: "reports",
});

// Permission actions
export const PermissionAction = Object.freeze({
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  EXPORT: "export",
});

// Helper to create permission string
export const createPermission = (module, action) => {
  return `${module}:${action}`;
};

// Default permissions for roles
export const DefaultPermissions = Object.freeze({
  ADMIN: [
    // Full access to all modules
    createPermission(PermissionModule.HEALTH, PermissionAction.VIEW),
    createPermission(PermissionModule.HEALTH, PermissionAction.CREATE),
    createPermission(PermissionModule.HEALTH, PermissionAction.EDIT),
    createPermission(PermissionModule.HEALTH, PermissionAction.DELETE),
    createPermission(PermissionModule.HEALTH, PermissionAction.EXPORT),
    
    createPermission(PermissionModule.EDUCATION, PermissionAction.VIEW),
    createPermission(PermissionModule.EDUCATION, PermissionAction.CREATE),
    createPermission(PermissionModule.EDUCATION, PermissionAction.EDIT),
    createPermission(PermissionModule.EDUCATION, PermissionAction.DELETE),
    createPermission(PermissionModule.EDUCATION, PermissionAction.EXPORT),
    
    createPermission(PermissionModule.SOCIAL_JUSTICE, PermissionAction.VIEW),
    createPermission(PermissionModule.SOCIAL_JUSTICE, PermissionAction.CREATE),
    createPermission(PermissionModule.SOCIAL_JUSTICE, PermissionAction.EDIT),
    createPermission(PermissionModule.SOCIAL_JUSTICE, PermissionAction.DELETE),
    createPermission(PermissionModule.SOCIAL_JUSTICE, PermissionAction.EXPORT),
    
    createPermission(PermissionModule.USERS, PermissionAction.VIEW),
    createPermission(PermissionModule.USERS, PermissionAction.CREATE),
    createPermission(PermissionModule.USERS, PermissionAction.EDIT),
    createPermission(PermissionModule.USERS, PermissionAction.DELETE),
    
    createPermission(PermissionModule.REPORTS, PermissionAction.VIEW),
    createPermission(PermissionModule.REPORTS, PermissionAction.EXPORT),
  ],
  USER: [
    // Default: View only access to all modules (Admin will customize)
    createPermission(PermissionModule.HEALTH, PermissionAction.VIEW),
    createPermission(PermissionModule.EDUCATION, PermissionAction.VIEW),
    createPermission(PermissionModule.SOCIAL_JUSTICE, PermissionAction.VIEW),
  ],
});
