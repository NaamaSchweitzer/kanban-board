import mongoose from "mongoose";
import {
  boardMessages,
  cardMessages,
  columnMessages,
} from "../constants/messages.js";
import { success, failure } from "../utils/serviceResult.js";
import { Board } from "../models/Board.js";
import { Card } from "../models/Card.js";
import { Column } from "../models/Column.js";
import {
  isPositionGapTight,
  newPositionBetween,
  rebalancePositions,
} from "../utils/position.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listCardsByBoardService = async (boardId) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, cardMessages.invalidBoardId);
  }

  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return failure(404, boardMessages.notFound);
  }

  const cards = await Card.find({ boardId }).sort({ columnId: 1, position: 1 });
  return success(cards);
};

export const listCardsByColumnService = async (columnId) => {
  if (!isValidObjectId(columnId)) {
    return failure(400, cardMessages.invalidColumnId);
  }

  const columnExists = await Column.exists({ _id: columnId });
  if (!columnExists) {
    return failure(404, columnMessages.notFound);
  }

  const cards = await Card.find({ columnId }).sort({ position: 1 });
  return success(cards);
};

export const getCardByIdService = async (cardId) => {
  if (!isValidObjectId(cardId)) {
    return failure(400, cardMessages.invalidId);
  }

  const card = await Card.findById(cardId);
  if (!card) {
    return failure(404, cardMessages.notFound);
  }

  return success(card);
};

export const createCardService = async ({
  boardId,
  columnId,
  title,
  description,
  dueDate,
}) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, cardMessages.invalidBoardId);
  }

  if (!isValidObjectId(columnId)) {
    return failure(400, cardMessages.invalidColumnId);
  }

  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return failure(404, boardMessages.notFound);
  }

  const column = await Column.findOne({ _id: columnId, boardId });
  if (!column) {
    return failure(404, cardMessages.boardOrColumnNotFound);
  }

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

  return success(card, 201);
};

export const updateCardService = async ({
  cardId,
  title,
  description,
  dueDate,
}) => {
  if (!isValidObjectId(cardId)) {
    return failure(400, cardMessages.invalidId);
  }

  const updates = {};

  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (dueDate !== undefined) updates.dueDate = dueDate;

  if (Object.keys(updates).length === 0) {
    return failure(400, cardMessages.noFieldsToUpdate);
  }

  const updated = await Card.findByIdAndUpdate(cardId, updates, { new: true });

  if (!updated) {
    return failure(404, cardMessages.notFound);
  }

  return success(updated);
};

export const deleteCardService = async (cardId) => {
  if (!isValidObjectId(cardId)) {
    return failure(400, cardMessages.invalidId);
  }

  const deleted = await Card.findByIdAndDelete(cardId);
  if (!deleted) {
    return failure(404, cardMessages.notFound);
  }

  return success(deleted);
};

export const moveCardService = async ({
  cardId,
  toColumnId,
  beforeCardId = null,
  afterCardId = null,
}) => {
  if (!toColumnId) {
    return failure(400, cardMessages.targetColumnRequired);
  }

  if (!isValidObjectId(cardId)) {
    return failure(400, cardMessages.invalidId);
  }

  if (!isValidObjectId(toColumnId)) {
    return failure(400, cardMessages.invalidColumnId);
  }

  if (beforeCardId && beforeCardId === afterCardId) {
    return failure(400, cardMessages.beforeAndAfterCannotMatch);
  }

  if (cardId === beforeCardId || cardId === afterCardId) {
    return failure(400, cardMessages.movedCannotBeNeighbor);
  }

  if (beforeCardId && !isValidObjectId(beforeCardId)) {
    return failure(400, cardMessages.invalidBeforeNeighbor);
  }

  if (afterCardId && !isValidObjectId(afterCardId)) {
    return failure(400, cardMessages.invalidAfterNeighbor);
  }

  const card = await Card.findById(cardId);
  if (!card) {
    return failure(404, cardMessages.notFound);
  }

  const targetCol = await Column.findOne({
    _id: toColumnId,
    boardId: card.boardId,
  }).lean();

  if (!targetCol) {
    return failure(400, cardMessages.invalidTargetColumn);
  }

  const beforeCard = beforeCardId
    ? await Card.findOne({ _id: beforeCardId, columnId: toColumnId }).lean()
    : null;

  const afterCard = afterCardId
    ? await Card.findOne({ _id: afterCardId, columnId: toColumnId }).lean()
    : null;

  if (beforeCardId && !beforeCard) {
    return failure(400, cardMessages.invalidBeforeNeighbor);
  }

  if (afterCardId && !afterCard) {
    return failure(400, cardMessages.invalidAfterNeighbor);
  }

  if (beforeCard && afterCard && beforeCard.position >= afterCard.position) {
    return failure(400, cardMessages.invalidNeighborOrder);
  }

  if (
    isPositionGapTight(
      beforeCard?.position ?? null,
      afterCard?.position ?? null,
    )
  ) {
    await rebalancePositions(Card, { columnId: toColumnId });
  }

  const refreshedBeforeCard = beforeCardId
    ? await Card.findOne({ _id: beforeCardId, columnId: toColumnId }).lean()
    : null;

  const refreshedAfterCard = afterCardId
    ? await Card.findOne({ _id: afterCardId, columnId: toColumnId }).lean()
    : null;

  card.columnId = toColumnId;
  card.position = newPositionBetween(
    refreshedBeforeCard?.position ?? beforeCard?.position ?? null,
    refreshedAfterCard?.position ?? afterCard?.position ?? null,
  );

  await card.save();

  return success(card);
};
