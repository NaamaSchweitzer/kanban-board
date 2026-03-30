import mongoose from "mongoose";
import { boardMessages, userMessages } from "../constants/messages.js";
import { success, failure } from "../utils/serviceResult.js";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";
import { User } from "../models/User.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listBoardsByOwnerService = async (ownerId) => {
  if (!isValidObjectId(ownerId))
    return failure(400, boardMessages.invalidOwnerId);

  const ownerExists = await User.exists({ _id: ownerId });
  if (!ownerExists) return failure(404, boardMessages.ownerNotFound);

  const boards = await Board.find({ ownerId }).sort({ createdAt: -1 });
  return success(boards);
};

export const listBoardsByMemberService = async (userId) => {
  if (!isValidObjectId(userId)) return failure(400, userMessages.invalidId);

  const userExists = await User.exists({ _id: userId });
  if (!userExists) return failure(404, boardMessages.memberNotFound);

  const boards = await Board.find({
    members: userId,
    ownerId: { $ne: userId },
  }).sort({ createdAt: -1 });

  return success(boards);
};

export const getBoardByIdService = async (boardId) => {
  if (!isValidObjectId(boardId)) return failure(400, boardMessages.invalidId);

  const board = await Board.findById(boardId).populate(
    "members",
    "username email",
  );
  if (!board) return failure(404, boardMessages.notFound);

  const columns = await Column.find({ boardId });
  const cards = await Card.find({ boardId }).populate(
    "assignee",
    "username email",
  );

  return success({ board, columns, cards });
};

export const createBoardService = async ({
  name,
  description = null,
  color = null,
  ownerId,
}) => {
  if (!isValidObjectId(ownerId))
    return failure(400, boardMessages.invalidOwnerId);

  const ownerExists = await User.exists({ _id: ownerId });
  if (!ownerExists) return failure(404, boardMessages.ownerNotFound);

  // create board with owner auto added as board member
  const board = await Board.create({
    name,
    description,
    color,
    ownerId,
    members: [ownerId],
  });

  return success(board, 201);
};

export const updateBoardService = async ({
  boardId,
  name,
  description,
  color,
}) => {
  if (!isValidObjectId(boardId)) return failure(400, boardMessages.invalidId);

  const updates = {};

  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (color !== undefined) updates.color = color;

  if (Object.keys(updates).length === 0) {
    return failure(400, boardMessages.noFieldsToUpdate);
  }

  const updatedBoard = await Board.findByIdAndUpdate(boardId, updates, {
    new: true,
  }).populate("members", "username email");

  if (!updatedBoard) return failure(404, boardMessages.notFound);

  return success(updatedBoard);
};

export const deleteBoardService = async (boardId) => {
  if (!isValidObjectId(boardId)) return failure(400, boardMessages.invalidId);

  const deletedBoard = await Board.findByIdAndDelete(boardId);
  if (!deletedBoard) return failure(404, boardMessages.notFound);

  // cascade delete
  await Column.deleteMany({ boardId });
  await Card.deleteMany({ boardId });

  return success(deletedBoard);
};

export const reorderColumnsService = async ({ boardId, columnIds }) => {
  if (!isValidObjectId(boardId)) return failure(400, boardMessages.invalidId);

  const board = await Board.findByIdAndUpdate(
    boardId,
    { $set: { columnIds } },
    { new: true },
  ).populate("members", "username email");

  if (!board) return failure(404, boardMessages.notFound);

  return success(board);
};

export const addMemberService = async (boardId, userId) => {
  if (!isValidObjectId(boardId)) return failure(400, boardMessages.invalidId);
  if (!isValidObjectId(userId)) return failure(400, userMessages.invalidId);

  const userExists = await User.exists({ _id: userId });
  if (!userExists) return failure(404, userMessages.notFound);

  const board = await Board.findById(boardId);
  if (!board) return failure(404, boardMessages.notFound);

  const isBoardMember = board.members.some((id) => id.toString() === userId);
  if (isBoardMember) return failure(400, boardMessages.memberAlreadyExists);

  const updated = await Board.findByIdAndUpdate(
    boardId,
    { $push: { members: userId } },
    { new: true },
  ).populate("members", "username email");

  return success(updated);
};

export const removeMemberService = async (boardId, userId) => {
  if (!isValidObjectId(boardId)) return failure(400, boardMessages.invalidId);
  if (!isValidObjectId(userId)) return failure(400, userMessages.invalidId);

  const board = await Board.findById(boardId);
  if (!board) return failure(404, boardMessages.notFound);

  if (board.ownerId.toString() === userId) {
    return failure(400, boardMessages.cannotRemoveOwner);
  }

  const isBoardMember = board.members.some((id) => id.toString() === userId);
  if (!isBoardMember) return failure(400, boardMessages.memberNotFound);

  const updated = await Board.findByIdAndUpdate(
    boardId,
    { $pull: { members: userId } },
    { new: true },
  ).populate("members", "username email");

  // unassign user from all board cards
  await Card.updateMany(
    { boardId, assignee: userId },
    { $set: { assignee: null } },
  );

  return success(updated);
};
