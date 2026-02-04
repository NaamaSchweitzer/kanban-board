import mongoose from "mongoose";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";

export const listBoardsByOwnerService = async (ownerId) => {
  const boards = await Board.find({ ownerId }).sort({ createdAt: -1 });
  return boards;
};

export const getBoardByIdService = async (boardId) => {
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    return { ok: false, status: 400, message: "Invalid boardId" };
  }

  const board = await Board.findById(boardId);
  if (!board) {
    return { ok: false, status: 404, message: "Board not found" };
  }

  const columns = await Column.find({ boardId }).sort({ position: 1 });
  const cards = await Card.find({ boardId }).sort({ columnId: 1, position: 1 });

  return { ok: true, status: 200, data: { board, columns, cards } };
};

export const createBoardService = async ({
  name,
  description = null,
  ownerId,
}) => {
  const board = await Board.create({ name, description, ownerId });
  return board;
};

export const updateBoardService = async ({ boardId, name, description }) => {
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;

  // nothing to update
  if (Object.keys(updates).length === 0) {
    return null;
  }

  const updatedBoard = await Board.findByIdAndUpdate(boardId, updates, {
    new: true,
  });

  return updatedBoard;
};

export const deleteBoardService = async (boardId) => {
  const deletedBoard = await Board.findByIdAndDelete(boardId);

  // if board didn't exist
  if (!deletedBoard) return null;

  // cascade delete
  await Column.deleteMany({ boardId });
  await Card.deleteMany({ boardId });

  return deletedBoard;
};
