import mongoose from "mongoose";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";

export const listColumnsByBoardService = async (boardId) => {
  const columns = await Column.find({ boardId }).sort({ position: 1 });
  return columns;
};

export const getColumnByIdService = async (columnId) => {
  if (!mongoose.Types.ObjectId.isValid(columnId)) {
    return { ok: false, status: 400, message: "Invalid columnId" };
  }

  const column = await Column.findById(columnId);
  if (!column) {
    return { ok: false, status: 404, message: "Column not found" };
  }

  const cards = await Card.find({ columnId }).sort({ position: 1 });

  return { ok: true, status: 200, data: { column, cards } };
};

export const createColumnService = async ({ title, boardId }) => {
  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return null; // TODO: throw error 404 board not found
  }

  // Put at end: find max position
  const last = await Column.findOne({ boardId }).sort({ position: -1 }).lean();
  const position = last ? last.position + 1000 : 1000;

  const column = await Column.create({ boardId, title, position });
  return column;
};

export const updateColumnService = async ({ columnId, title }) => {
  const updates = {};

  if (title !== undefined) updates.title = title;

  // nothing to update
  if (Object.keys(updates).length === 0) {
    return null;
  }

  const updatedColumn = await Column.findByIdAndUpdate(columnId, updates, {
    new: true,
  });

  return updatedColumn;
};

export const deleteColumnService = async (columnId) => {
  const deletedColumn = await Column.findByIdAndDelete(columnId);

  // if column didn't exist
  if (!deletedColumn) return null;

  // cascade delete
  await Card.deleteMany({ columnId });

  return deletedColumn;
};
