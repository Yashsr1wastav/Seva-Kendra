import { errorWrapper } from "../../middleware/errorWrapper.js";
import { responseUtils } from "../../utils/response.utils.js";
import { UserRole } from "./user.enum.js";
import {
  createUser as createUserService,
  findByEmail,
  findById,
  listUsers,
} from "./user.service.js";
import { stripUserData } from "./user.utils.js";

export const addUser = errorWrapper(async (req, res) => {
  const adminId = req.user.sub;
  const { email, password, role = UserRole.USER } = req.body;

  if (role === UserRole.ADMIN)
    throw { statusCode: 403, message: "Cannot create another admin" };

  if (await findByEmail(email))
    throw { statusCode: 409, message: "Email already exists" };

  const user = await createUserService({
    email,
    password,
    role,
    createdBy: adminId,
  });

  responseUtils.success(res, {
    status: 201,
    data: stripUserData(user),
  });
});

export const getUsers = errorWrapper(async (req, res) => {
  const { users, total, page, limit } = await listUsers(req.query);

  responseUtils.success(res, {
    status: 200,
    data: {
      users: users.map(stripUserData),
      total,
      page,
      limit,
    },
  });
});

export const getUser = errorWrapper(async (req, res) => {
  const user = await findById(req.params.id);

  if (!user)
    throw {
      statusCode: 404,
      message: "User not found",
    };

  responseUtils.success(res, {
    status: 200,
    data: stripUserData(user),
  });
});

// Additional CRUD operations for router compatibility
export const createUser = addUser;
export const getAllUsers = getUsers;
export const getUserById = getUser;
export const updateUser = getUser; // Placeholder
export const deleteUser = getUser; // Placeholder
