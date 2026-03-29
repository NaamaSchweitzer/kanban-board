import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/User.js";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";
import { userMessages } from "../constants/messages.js";
import { success, failure } from "../utils/serviceResult.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const signToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

export const getAllUsersService = async () => {
  const users = await User.find({});
  return success(users);
};

export const getUserByIdService = async (userId) => {
  if (!isValidObjectId(userId)) {
    return failure(400, userMessages.invalidId);
  }

  const user = await User.findById(userId);
  if (!user) {
    return failure(404, userMessages.notFound);
  }

  return success(user);
};

export const registerUserService = async ({ username, email, password }) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = await User.create({
    username,
    email,
    password: hash,
  });

  const token = signToken(user);

  // Return user without password (toObject strips select:false fields
  // only on queries, so we do it manually after create)
  const userObject = user.toObject();
  delete userObject.password;

  return success({ user: userObject, token }, 201);
};

export const loginService = async (email, password) => {
  // Need +password since the field has select: false
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return failure(401, userMessages.invalidCredentials);
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return failure(401, userMessages.invalidCredentials);
  }

  const token = signToken(user);

  const userObject = user.toObject();
  delete userObject.password;

  return success({ user: userObject, token });
};

export const updateUserService = async (userId, updates) => {
  if (!isValidObjectId(userId)) {
    return failure(400, userMessages.invalidId);
  }

  if (Object.keys(updates).length === 0) {
    return failure(400, userMessages.noFieldsToUpdate);
  }

  const updated = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return failure(404, userMessages.notFound);
  }

  return success(updated);
};

export const deleteUserService = async (userId) => {
  if (!isValidObjectId(userId)) return failure(400, userMessages.invalidId);

  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) return failure(404, userMessages.notFound);

  // cascade delete all boards owned by this user (and their columns/cards)
  const ownedBoards = await Board.find({ ownerId: userId }, "_id");
  const ownedBoardIds = ownedBoards.map((b) => b._id);

  if (ownedBoardIds.length > 0) {
    await Card.deleteMany({ boardId: { $in: ownedBoardIds } });
    await Column.deleteMany({ boardId: { $in: ownedBoardIds } });
    await Board.deleteMany({ _id: { $in: ownedBoardIds } });
  }

  // remove user from boards they're a member of (not owner)
  await Board.updateMany(
    { memberIds: userId },
    { $pull: { memberIds: userId } },
  );

  // unassign from all cards on other boards (not owned by user)
  await Card.updateMany({ assigneeId: userId }, { $set: { assigneeId: null } });

  return success(deleted);
};

export const changePasswordService = async (
  userId,
  oldPassword,
  newPassword,
) => {
  if (!isValidObjectId(userId)) {
    return failure(400, userMessages.invalidId);
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    return failure(404, userMessages.notFound);
  }

  const isMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch) {
    return failure(400, userMessages.wrongPassword);
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  await User.findByIdAndUpdate(userId, { password: hash });

  return success({ message: "Password changed successfully" });
};
