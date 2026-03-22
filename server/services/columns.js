import mongoose from "mongoose";
import { columnMessages, boardMessages } from "../constants/messages.js";
import { success, failure } from "../utils/serviceResult.js";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listColumnsByBoardService = async (boardId) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, columnMessages.invalidBoardId);
  }

  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return failure(404, boardMessages.notFound);
  }

  const columns = await Column.find({ boardId });
  return success(columns);
};

export const getColumnByIdService = async (columnId) => {
  if (!isValidObjectId(columnId)) {
    return failure(400, columnMessages.invalidId);
  }

  const column = await Column.findById(columnId);
  if (!column) {
    return failure(404, columnMessages.notFound);
  }

  const cards = await Card.find({ columnId });

  return success({ column, cards });
};

export const createColumnService = async ({ title, boardId }) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, boardMessages.invalidId);
  }

  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return failure(404, boardMessages.notFound);
  }

  const column = await Column.create({ boardId, title });

  // Append to board's columnIds to register the order
  await Board.findByIdAndUpdate(boardId, { $push: { columnIds: column._id } });

  return success(column, 201);
};

export const updateColumnService = async ({ columnId, title }) => {
  if (!isValidObjectId(columnId)) {
    return failure(400, columnMessages.invalidId);
  }

  const updates = {};
  if (title !== undefined) updates.title = title;

  if (Object.keys(updates).length === 0) {
    return failure(400, columnMessages.noFieldsToUpdate);
  }

  const updatedColumn = await Column.findByIdAndUpdate(columnId, updates, {
    new: true,
  });

  if (!updatedColumn) {
    return failure(404, columnMessages.notFound);
  }

  return success(updatedColumn);
};

export const deleteColumnService = async (columnId) => {
  if (!isValidObjectId(columnId)) {
    return failure(400, columnMessages.invalidId);
  }

  const deletedColumn = await Column.findByIdAndDelete(columnId);
  if (!deletedColumn) {
    return failure(404, columnMessages.notFound);
  }

  // Remove from board's columnIds
  await Board.findByIdAndUpdate(deletedColumn.boardId, {
    $pull: { columnIds: deletedColumn._id },
  });

  // Cascade delete all cards in this column
  await Card.deleteMany({ columnId });

  return success(deletedColumn);
};

// same column reorder
export const reorderCardsService = async ({ columnId, cardIds }) => {
  if (!isValidObjectId(columnId)) {
    return failure(400, columnMessages.invalidId);
  }

  const column = await Column.findByIdAndUpdate(
    columnId,
    { $set: { cardIds } },
    { new: true },
  );

  if (!column) return failure(404, columnMessages.notFound);

  return success(column);
};
