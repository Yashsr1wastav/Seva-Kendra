import { generateAPIError } from "../errors/apiError.js";
import { PermissionModule, PermissionAction, createPermission } from "../modules/user/permission.enum.js";
import { UserRole } from "../modules/user/user.enum.js";

/**
 * Middleware to check if user has specific permission
 * @param {string} module - Module name from PermissionModule
 * @param {string} action - Action name from PermissionAction
 */
export const checkPermission = (module, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        throw await generateAPIError("Unauthorized", 401);
      }

      // Admin has all permissions
      if (user.role === UserRole.ADMIN) {
        return next();
      }

      const requiredPermission = createPermission(module, action);
      const hasPermission = user.permissions && user.permissions.includes(requiredPermission);

      if (!hasPermission) {
        throw await generateAPIError(
          `You don't have permission to ${action} ${module}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user has any of the specified permissions
 * @param {Array} permissionPairs - Array of [module, action] pairs
 */
export const checkAnyPermission = (permissionPairs) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        throw await generateAPIError("Unauthorized", 401);
      }

      // Admin has all permissions
      if (user.role === UserRole.ADMIN) {
        return next();
      }

      const hasAnyPermission = permissionPairs.some(([module, action]) => {
        const requiredPermission = createPermission(module, action);
        return user.permissions && user.permissions.includes(requiredPermission);
      });

      if (!hasAnyPermission) {
        throw await generateAPIError(
          "You don't have permission to access this resource",
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to ensure only admin can access
 */
export const adminOnly = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw await generateAPIError("Unauthorized", 401);
    }

    if (user.role !== UserRole.ADMIN) {
      throw await generateAPIError("Admin access required", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to check permission in controller
 * @param {Object} user - User object
 * @param {string} module - Module name
 * @param {string} action - Action name
 * @returns {boolean}
 */
export const hasPermission = (user, module, action) => {
  if (!user) return false;
  if (user.role === UserRole.ADMIN) return true;
  
  const requiredPermission = createPermission(module, action);
  return user.permissions && user.permissions.includes(requiredPermission);
};

export { PermissionModule, PermissionAction };
