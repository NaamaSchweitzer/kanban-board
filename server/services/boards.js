import mongoose from "mongoose";
import { boardMessages } from "../constants/messages.js";
import { success, failure } from "../utils/serviceResult.js";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";
import { User } from "../models/User.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listBoardsByOwnerService = async (ownerId) => {
  if (!isValidObjectId(ownerId)) {
    return failure(400, boardMessages.invalidOwnerId);
  }

  const ownerExists = await User.exists({ _id: ownerId });
  if (!ownerExists) {
    return failure(404, boardMessages.ownerNotFound);
  }

  const boards = await Board.find({ ownerId }).sort({ createdAt: -1 });
  return success(boards);
};

export const getBoardByIdService = async (boardId) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, boardMessages.invalidId);
  }

  const board = await Board.findById(boardId);
  if (!board) {
    return failure(404, boardMessages.notFound);
  }

  const columns = await Column.find({ boardId });
  const cards = await Card.find({ boardId });

  return success({ board, columns, cards });
};

export const createBoardService = async ({
  name,
  description = null,
  ownerId,
}) => {
  if (!isValidObjectId(ownerId)) {
    return failure(400, boardMessages.invalidOwnerId);
  }

  const ownerExists = await User.exists({ _id: ownerId });
  if (!ownerExists) {
    return failure(404, boardMessages.ownerNotFound);
  }

  const board = await Board.create({ name, description, ownerId });
  return success(board, 201);
};

export const updateBoardService = async ({ boardId, name, description }) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, boardMessages.invalidId);
  }

  const updates = {};

  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;

  if (Object.keys(updates).length === 0) {
    return failure(400, boardMessages.noFieldsToUpdate);
  }

  const updatedBoard = await Board.findByIdAndUpdate(boardId, updates, {
    new: true,
  });

  if (!updatedBoard) {
    return failure(404, boardMessages.notFound);
  }

  return success(updatedBoard);
};

export const deleteBoardService = async (boardId) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, boardMessages.invalidId);
  }

  const deletedBoard = await Board.findByIdAndDelete(boardId);

  if (!deletedBoard) return failure(404, boardMessages.notFound);

  await Column.deleteMany({ boardId });
  await Card.deleteMany({ boardId });

  return success(deletedBoard);
};

export const reorderColumnsService = async ({ boardId, columnIds }) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, boardMessages.invalidId);
  }

  const board = await Board.findByIdAndUpdate(
    boardId,
    { $set: { columnIds } },
    { new: true },
  );

  if (!board) return failure(404, boardMessages.notFound);

  return success(board);
};
