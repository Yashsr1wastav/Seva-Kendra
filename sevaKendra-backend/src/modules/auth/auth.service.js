import { generateToken } from "../../utils/auth.utils.js";
import User from "../user/user.model.js";
import { APIError } from "../../errors/apiError.js";

/**
 * Register a new user
 */
export const register = async (userData) => {
  const { email, password, role = "user" } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new APIError("User with this email already exists", 400);
  }

  // Create new user (password will be hashed by the pre-save hook)
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    role,
    status: "active",
  });

  // Generate token
  const token = await generateToken({
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  // Return user without password
  const userResponse = {
    id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  return {
    user: userResponse,
    token,
  };
};

/**
 * Login user
 */
export const login = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new APIError("Invalid email or password", 401);
  }

  // Check if user is active
  if (user.status !== "active") {
    throw new APIError("Account is not active. Please contact administrator.", 403);
  }

  // Verify password using the model method
  const isPasswordValid = await user.passwordMatch(password);
  if (!isPasswordValid) {
    throw new APIError("Invalid email or password", 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = await generateToken({
    userId: user._id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
  });

  // Return user without password
  const userResponse = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    permissions: user.permissions,
  };

  return {
    user: userResponse,
    token,
  };
};

/**
 * Logout user (token invalidation handled client-side)
 */
export const logout = async () => {
  // In a real implementation, you might want to blacklist the token
  // For now, logout is handled client-side by removing the token
  return { message: "Logged out successfully" };
};

/**
 * Verify token and get user
 */
export const verifyToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new APIError("User not found", 404);
  }

  if (user.status !== "active") {
    throw new APIError("Account is not active", 403);
  }

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};
