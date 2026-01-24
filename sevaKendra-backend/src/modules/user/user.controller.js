import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { UserRole } from "./user.enum.js";
import * as userService from "./user.service.js";
import { stripUserData } from "./user.utils.js";

export const addUser = errorWrapper(async (req, res) => {
  const adminId = req.user._id;
  const { email, password, firstName, lastName, role = UserRole.USER, permissions } = req.body;

  if (role === UserRole.ADMIN && req.user.role !== UserRole.ADMIN) {
    throw { statusCode: 403, message: "Cannot create admin user" };
  }

  const user = await userService.createUserByAdmin({
    email,
    password,
    firstName,
    lastName,
    role,
    permissions
  }, adminId);

  responseUtils.success(res, {
    status: 201,
    data: stripUserData(user),
    message: "User created successfully",
  });
});

export const getUsers = errorWrapper(async (req, res) => {
  const result = await userService.getAllUsers(req.query);

  responseUtils.success(res, {
    status: 200,
    data: result,
    message: "Users retrieved successfully",
  });
});

export const getUser = errorWrapper(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  responseUtils.success(res, {
    status: 200,
    data: stripUserData(user),
    message: "User retrieved successfully",
  });
});

export const updateUserData = errorWrapper(async (req, res) => {
  const result = await userService.updateUser(req.params.id, req.body);
  responseUtils.success(res, {
    status: 200,
    data: stripUserData(result),
    message: "User updated successfully",
  });
});

export const removeUser = errorWrapper(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  responseUtils.success(res, {
    status: 200,
    data: result,
    message: "User deleted successfully",
  });
});

export const updatePermissions = errorWrapper(async (req, res) => {
  const { permissions } = req.body;
  const result = await userService.updateUserPermissions(req.params.id, permissions);
  responseUtils.success(res, {
    status: 200,
    data: stripUserData(result),
    message: "User permissions updated successfully",
  });
});

export const getStats = errorWrapper(async (req, res) => {
  const result = await userService.getUserStats();
  responseUtils.success(res, {
    status: 200,
    data: result,
    message: "User statistics retrieved successfully",
  });
});

export const getProfile = errorWrapper(async (req, res) => {
  const result = await userService.getUserById(req.user._id);
  responseUtils.success(res, {
    status: 200,
    data: stripUserData(result),
    message: "Current user retrieved successfully",
  });
});

// Aliases for compatibility
export const createUser = addUser;
export const getAllUsers = getUsers;
export const getUserById = getUser;
export const updateUser = updateUserData;
export const deleteUser = removeUser;
export const getUserStats = getStats;
export const getCurrentUser = getProfile;
export const updateUserPermissions = updatePermissions;

