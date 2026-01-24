import { UserStatus, UserRole } from "./user.enum.js";
import { DefaultPermissions } from "./permission.enum.js";
import { generateAPIError } from "../../errors/apiError.js";
import User from "./user.model.js";

export const createUser = async (payload) => {
  if (!payload.status) payload.status = UserStatus.ACTIVE;
  if (!payload.permissions) {
    payload.permissions = payload.role === UserRole.ADMIN 
      ? DefaultPermissions.ADMIN 
      : DefaultPermissions.USER;
  }
  return User.create(payload);
};

export const findById = async (id) => User.findById(id);

export const findByEmail = async (email) => User.findOne({ email });

export const listUsers = async ({ page = 1, limit = 20 }) => {
  const p = parseInt(page, 20) || 1;
  const l = parseInt(limit, 10) || 20;
  const skip = (page - 1) * l;
  const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(l);
  const total = await User.countDocuments();
  return { users, total, page: p, limit: l };
};

/**
 * Get all users with filters (Admin only)
 */
export const getAllUsers = async (query) => {
  const { page = 1, limit = 10, search = "", role, status } = query;
  
  const filter = {};
  
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  
  if (role) {
    filter.role = role;
  }
  
  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate("createdBy", "firstName lastName email");
  
  if (!user) {
    throw await generateAPIError("User not found", 404);
  }
  
  return user;
};

/**
 * Create new user (Admin only)
 */
export const createUserByAdmin = async (userData, adminId) => {
  const { email, password, firstName, lastName, role, permissions } = userData;
  
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw await generateAPIError("User with this email already exists", 400);
  }
  
  const user = new User({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    role: role || UserRole.USER,
    status: UserStatus.ACTIVE,
    permissions: permissions || (role === UserRole.ADMIN ? DefaultPermissions.ADMIN : DefaultPermissions.USER),
    createdBy: adminId,
  });
  
  await user.save();
  
  const userObj = user.toObject();
  delete userObj.password;
  
  return userObj;
};

/**
 * Update user
 */
export const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw await generateAPIError("User not found", 404);
  }
  
  const { email, firstName, lastName, role, status, permissions, password } = updateData;
  
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw await generateAPIError("Email already in use", 400);
    }
    user.email = email.toLowerCase();
  }
  
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (role) user.role = role;
  if (status) user.status = status;
  if (permissions) user.permissions = permissions;
  
  if (password) {
    user.password = password;
  }
  
  await user.save();
  
  const userObj = user.toObject();
  delete userObj.password;
  
  return userObj;
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw await generateAPIError("User not found", 404);
  }
  
  if (user.role === UserRole.ADMIN) {
    const adminCount = await User.countDocuments({ role: UserRole.ADMIN });
    if (adminCount <= 1) {
      throw await generateAPIError("Cannot delete the last admin user", 400);
    }
  }
  
  await User.findByIdAndDelete(userId);
  
  return { message: "User deleted successfully" };
};

/**
 * Update user permissions
 */
export const updateUserPermissions = async (userId, permissions) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw await generateAPIError("User not found", 404);
  }
  
  if (user.role === UserRole.ADMIN) {
    throw await generateAPIError("Cannot modify admin permissions directly", 400);
  }
  
  user.permissions = permissions;
  await user.save();
  
  const userObj = user.toObject();
  delete userObj.password;
  
  return userObj;
};

/**
 * Get user statistics
 */
export const getUserStats = async () => {
  const [totalUsers, activeUsers, pendingUsers, suspendedUsers, adminCount, userCount] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: UserStatus.ACTIVE }),
    User.countDocuments({ status: UserStatus.PENDING }),
    User.countDocuments({ status: UserStatus.SUSPENDED }),
    User.countDocuments({ role: UserRole.ADMIN }),
    User.countDocuments({ role: UserRole.USER }),
  ]);
  
  return {
    totalUsers,
    activeUsers,
    pendingUsers,
    suspendedUsers,
    adminCount,
    userCount,
  };
};

