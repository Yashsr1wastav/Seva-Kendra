import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import * as authService from "./auth.service.js";
import { generateToken } from "../../utils/auth.utils.js";
import mongoose from "mongoose";

export const register = errorWrapper(async (req, res) => {
  const result = await authService.register(req.body);
  responseUtils.success(res, {
    status: 201,
    data: result,
    message: "User registered successfully",
  });
});

export const login = errorWrapper(async (req, res) => {
  const result = await authService.login(req.body);
  responseUtils.success(res, {
    status: 200,
    data: result,
    message: "Login successful",
  });
});

// Dummy login for development - generates real JWT token
export const dummyLogin = errorWrapper(async (req, res) => {
  const { email, password } = req.body;
  // Only allow dummy login in non-production environments
  if (process.env.NODE_ENV === "production") {
    return responseUtils.error(res, { status: 403, message: "Not allowed in production" });
  }

  // Support configurable dummy credentials via env (useful for local/dev)
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  // Check dummy credentials
  if (email && password && email.toLowerCase() === adminEmail && password === adminPassword) {
    const dummyUser = {
      id: new mongoose.Types.ObjectId("64b8f0f5f1d2c9a1b2c3d4e5"),
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      role: "admin",
      status: "active",
    };

    // Generate real JWT token
    const token = await generateToken({
      userId: dummyUser.id,
      email: dummyUser.email,
      role: dummyUser.role,
    });

    responseUtils.success(res, {
      status: 200,
      data: { user: dummyUser, token },
      message: "Dummy login successful",
    });
  } else {
    responseUtils.error(res, {
      status: 401,
      message: "Invalid credentials",
    });
  }
});

export const logout = errorWrapper(async (req, res) => {
  await authService.logout(req.user.id);
  responseUtils.success(res, {
    status: 200,
    message: "Logout successful",
  });
});

export const verifyToken = errorWrapper(async (req, res) => {
  const result = await authService.verifyToken(req.headers.authorization);
  responseUtils.success(res, {
    status: 200,
    data: result,
    message: "Token verified",
  });
});