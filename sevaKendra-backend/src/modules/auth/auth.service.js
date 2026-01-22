import { generateToken } from "../../utils/auth.utils.js";
import User from "../user/user.model.js";
import { ApiError } from "../../errors/apiError.js";

/**
 * Register a new user
 */
export const register = async (userData) => {
  const { email, password, role = "user" } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
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
    throw new ApiError(401, "Invalid email or password");
  }

  // Check if user is active
  if (user.status !== "active") {
    throw new ApiError(403, "Account is not active. Please contact administrator.");
  }

  // Verify password using the model method
  const isPasswordValid = await user.passwordMatch(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

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
    throw new ApiError(404, "User not found");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "Account is not active");
  }

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};
