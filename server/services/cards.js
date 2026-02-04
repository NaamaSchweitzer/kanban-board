import mongoose from "mongoose";
import { Board } from "../models/Board.js";
import { Card } from "../models/Card.js";
import { Column } from "../models/Column.js";

export const listCardsByBoardService = async (boardId) => {
  const cards = await Card.find({ boardId }).sort({ columnId: 1, position: 1 });
  return cards;
};

export const listCardsByColumnService = async (columnId) => {
  const cards = await Card.find({ columnId }).sort({ position: 1 });
  return cards;
};

export const getCardByIdService = async (cardId) => {
  const card = await Card.findById(cardId);
  return card;
};

export const createCardService = async ({
  boardId,
  columnId,
  title,
  description,
  dueDate,
}) => {
  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return null; // TODO: throw error 404 board not found
  }

  const column = await Column.findOne({ _id: columnId, boardId });
  if (!column) {
    return null; // TODO: throw error 400 columnId does not belong to boardId
  }

  // Put at end: find max position
  const last = await Card.findOne({ columnId }).sort({ position: -1 }).lean();
  const position = last ? last.position + 1000 : 1000;

  const card = await Card.create({
    boardId,
    columnId,
    title,
    description,
    dueDate,
    position,
  });

  return card;
};

export const updateCardService = async ({
  cardId,
  title,
  description,
  dueDate,
}) => {
  const updates = {};

  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (dueDate !== undefined) updates.dueDate = dueDate;

  // nothing to update
  if (Object.keys(updates).length === 0) {
    return null;
  }

  const updated = await Card.findByIdAndUpdate(cardId, updates, { new: true });

  return updated;
};

export const deleteCardService = async (cardId) => {
  const deleted = await Card.findByIdAndDelete(cardId);
  return deleted;
};
