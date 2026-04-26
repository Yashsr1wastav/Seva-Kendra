import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { appConfig } from "../config/appConfig.js";

export const generateToken = async (data, expiryTime) => {
  const options = {
    expiresIn: expiryTime ?? "5d",
  };
  return jwt.sign({ ...data }, appConfig.jwtSecret, options);
};

export const decodeToken = async (req, res, next) => {
  if (!req.headers.authorization?.startsWith("Bearer")) {
    res.status(401).send({ message: "Not Authorized,No token" });
    return null;
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).send({ message: "Not Authorized,No token" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, appConfig.jwtSecret);
    return decoded || null;
  } catch (error) {
    res.status(401).send({ message: "Not Authorized" });
    return null;
  }
};

export const verifyValue = async (value, hashedValue) => {
  return await bcrypt.compare(value, hashedValue);
};
