import { commonMessages, userMessages } from "../constants/messages.js";
import { serverResponse } from "../utils/serverResponse.js";
import {
  getAllUsersService,
  getUserByIdService,
  registerUserService,
  loginService,
  updateUserService,
  deleteUserService,
  changePasswordService,
} from "../services/users.js";

const getDuplicateKeyMessage = (err) => {
  const field = Object.keys(err.keyPattern || {})[0];

  const fieldMap = {
    email: userMessages.emailAlreadyExists,
    username: userMessages.usernameAlreadyExists,
  };

  return fieldMap[field] || userMessages.duplicateField;
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await getAllUsersService();

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("getAllUsers error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await getUserByIdService(userId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("getUserById error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return serverResponse(res, 400, userMessages.registerRequiredFields);
    }

    const result = await registerUserService({ username, email, password });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    if (err.code === 11000) {
      const message = getDuplicateKeyMessage(err);
      return serverResponse(res, 400, message);
    }
    console.error("registerUser error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return serverResponse(res, 400, userMessages.loginRequiredFields);
    }

    const result = await loginService(email, password);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("login error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const allowed = new Set(["username", "email"]);
    const incomingKeys = Object.keys(req.body);
    const invalidKeys = incomingKeys.filter((k) => !allowed.has(k));

    if (invalidKeys.length) {
      return serverResponse(
        res,
        400,
        commonMessages.invalidFields(invalidKeys),
      );
    }

    const result = await updateUserService(userId, req.body);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    if (err.code === 11000) {
      const message = getDuplicateKeyMessage(err);
      return serverResponse(res, 400, message);
    }

    console.error("updateUser error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await deleteUserService(userId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("deleteUser error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return serverResponse(
        res,
        400,
        userMessages.changePasswordRequiredFields,
      );
    }

    const result = await changePasswordService(
      userId,
      oldPassword,
      newPassword,
    );

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("changePassword error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};
