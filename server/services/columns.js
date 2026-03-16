import mongoose from "mongoose";
import { columnMessages } from "../constants/messages.js";
import { boardMessages } from "../constants/messages.js";
import { success, failure } from "../utils/serviceResult.js";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";
import {
  isPositionGapTight,
  newPositionBetween,
  rebalancePositions,
} from "../utils/position.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listColumnsByBoardService = async (boardId) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, columnMessages.invalidBoardId);
  }

  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return failure(404, boardMessages.notFound);
  }

  const columns = await Column.find({ boardId }).sort({ position: 1 });
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

  const cards = await Card.find({ columnId }).sort({ position: 1 });

  return success({ column, cards });
};

export const createColumnService = async ({ title, boardId }) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, columnMessages.invalidBoardId);
  }

  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return failure(404, boardMessages.notFound);
  }

  const last = await Column.findOne({ boardId }).sort({ position: -1 }).lean();
  const position = last ? last.position + 1000 : 1000;

  const column = await Column.create({ boardId, title, position });
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

  if (!deletedColumn) return failure(404, columnMessages.notFound);

  await Card.deleteMany({ columnId });

  return success(deletedColumn);
};

export const moveColumnService = async ({
  columnId,
  beforeColumnId = null,
  afterColumnId = null,
}) => {
  if (!isValidObjectId(columnId)) {
    return failure(400, columnMessages.invalidId);
  }

  if (beforeColumnId && beforeColumnId === afterColumnId) {
    return failure(400, columnMessages.beforeAndAfterCannotMatch);
  }

  if (columnId === beforeColumnId || columnId === afterColumnId) {
    return failure(400, columnMessages.movedCannotBeNeighbor);
  }

  const column = await Column.findById(columnId);
  if (!column) {
    return failure(404, columnMessages.notFound);
  }

  const boardId = column.boardId;

  if (beforeColumnId && !isValidObjectId(beforeColumnId)) {
    return failure(400, columnMessages.invalidBeforeNeighbor);
  }

  if (afterColumnId && !isValidObjectId(afterColumnId)) {
    return failure(400, columnMessages.invalidAfterNeighbor);
  }

  const before = beforeColumnId
    ? await Column.findOne({ _id: beforeColumnId, boardId }).lean()
    : null;

  const after = afterColumnId
    ? await Column.findOne({ _id: afterColumnId, boardId }).lean()
    : null;

  if (beforeColumnId && !before) {
    return failure(400, columnMessages.invalidBeforeNeighbor);
  }

  if (afterColumnId && !after) {
    return failure(400, columnMessages.invalidAfterNeighbor);
  }

  if (before && after && before.position >= after.position) {
    return failure(400, columnMessages.invalidNeighborOrder);
  }

  if (isPositionGapTight(before?.position ?? null, after?.position ?? null)) {
    await rebalancePositions(Column, { boardId });
  }

  const refreshedBefore = beforeColumnId
    ? await Column.findOne({ _id: beforeColumnId, boardId }).lean()
    : null;

  const refreshedAfter = afterColumnId
    ? await Column.findOne({ _id: afterColumnId, boardId }).lean()
    : null;

  column.position = newPositionBetween(
    refreshedBefore?.position ?? before?.position ?? null,
    refreshedAfter?.position ?? after?.position ?? null,
  );

  await column.save();

  return success(column);
};
