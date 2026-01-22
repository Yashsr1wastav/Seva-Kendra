import { responseUtils } from "../utils/response.utils.js";
import { errorWrapper } from "../middleware/errorWrapper.js";
import { successMessage } from "../constant/messages.js";
import mongoose from "mongoose";

const healthCheck = errorWrapper(async (req, res, next) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  
  return responseUtils.success(res, {
    data: {
      message: successMessage.healthOk,
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || "development",
    },
    status: 200,
  });
});

export { healthCheck };
