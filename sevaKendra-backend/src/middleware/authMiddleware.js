import { decodeToken } from "../utils/auth.utils.js";
import { APIError } from "../errors/apiError.js";
import { errorMessage } from "../constant/messages.js";
import User from "../modules/user/user.model.js";
import { UserStatus } from "../modules/user/user.enum.js";

const verifyTokenExists = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const decoded = await decodeToken(req, res, next);
    if (decoded) {
      // Fetch user to include permissions
      const user = await User.findById(decoded.userId);

      if (user) {
        req.user = {
          _id: user._id,
          id: user._id,
          email: user.email,
          role: user.role,
          permissions: user.permissions || [],
        };
      } else {
        req.user = {
          _id: decoded.userId,
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          permissions: [],
        };
      }
      req.decodedToken = decoded;
      return next();
    }
  }

  return next();
};

const verifyUserRole = (allowedRoles) => {
  return async (req, res, next) => {
    const decoded = await decodeToken(req, res, next);

    if (decoded) {
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new APIError(errorMessage.userNotFoundWithId, 404));
      }

      if (user.status !== UserStatus.ACTIVE) {
        return next(new APIError(errorMessage.userAccountBlocked, 403));
      }

      if (allowedRoles.length === 0) {
        req.user = user;
        req.user.currentRole = decoded.role;
        req.user.permissions = user.permissions || [];
        return next();
      }

      const hasAccess = allowedRoles.includes(decoded.role);

      if (hasAccess) {
        req.user = user;
        req.user.currentRole = decoded.role;
        req.user.permissions = user.permissions || [];
        return next();
      }

      res.status(403).send({ message: "Access denied. Insufficient permissions." });
    }
  };
};

export { verifyTokenExists, verifyUserRole };
