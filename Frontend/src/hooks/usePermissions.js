import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook to check user permissions
 * @returns {Object} Permission checking utilities
 */
export const usePermissions = () => {
  const { user } = useAuth();

  /**
   * Check if user has specific permission
   * @param {string} module - Module name (health, education, socialJustice)
   * @param {string} action - Action name (view, create, edit, delete, export)
   * @returns {boolean}
   */
  const hasPermission = (module, action) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    const permission = `${module}:${action}`;
    return user.permissions?.includes(permission) || false;
  };

  /**
   * Check if user has any access to a module
   * @param {string} module - Module name
   * @returns {boolean}
   */
  const hasModuleAccess = (module) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return user.permissions?.some(p => p.startsWith(`${module}:`)) || false;
  };

  /**
   * Check if user can view data in a module
   * @param {string} module - Module name
   * @returns {boolean}
   */
  const canView = (module) => hasPermission(module, "view");

  /**
   * Check if user can create data in a module
   * @param {string} module - Module name
   * @returns {boolean}
   */
  const canCreate = (module) => hasPermission(module, "create");

  /**
   * Check if user can edit data in a module
   * @param {string} module - Module name
   * @returns {boolean}
   */
  const canEdit = (module) => hasPermission(module, "edit");

  /**
   * Check if user can delete data in a module
   * @param {string} module - Module name
   * @returns {boolean}
   */
  const canDelete = (module) => hasPermission(module, "delete");

  /**
   * Check if user can export data from a module
   * @param {string} module - Module name
   * @returns {boolean}
   */
  const canExport = (module) => hasPermission(module, "export");

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => user?.role === "admin";

  /**
   * Get all user permissions
   * @returns {string[]}
   */
  const getPermissions = () => user?.permissions || [];

  return {
    hasPermission,
    hasModuleAccess,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    isAdmin,
    getPermissions,
    user,
  };
};

export default usePermissions;
