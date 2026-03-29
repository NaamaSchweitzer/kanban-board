import mongoose from "mongoose";
import {
  boardMessages,
  cardMessages,
  columnMessages,
  userMessages,
} from "../constants/messages.js";
import { success, failure } from "../utils/serviceResult.js";
import { Board } from "../models/Board.js";
import { Card } from "../models/Card.js";
import { Column } from "../models/Column.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listCardsByBoardService = async (boardId) => {
  if (!isValidObjectId(boardId)) {
    return failure(400, boardMessages.invalidId);
  }

  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return failure(404, boardMessages.notFound);
  }

  const cards = await Card.find({ boardId });
  return success(cards);
};

export const listCardsByColumnService = async (columnId) => {
  if (!isValidObjectId(columnId)) {
    return failure(400, columnMessages.invalidId);
  }

  const columnExists = await Column.exists({ _id: columnId });
  if (!columnExists) {
    return failure(404, columnMessages.notFound);
  }

  const cards = await Card.find({ columnId });
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
    return failure(400, boardMessages.invalidId);
  }

  if (!isValidObjectId(columnId)) {
    return failure(400, columnMessages.invalidId);
  }

  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    return failure(404, boardMessages.notFound);
  }

  const column = await Column.findOne({ _id: columnId, boardId });
  if (!column) {
    return failure(404, cardMessages.boardOrColumnNotFound);
  }

  const card = await Card.create({
    boardId,
    columnId,
    title,
    description,
    dueDate,
  });

  // append to column's cardIds to register the order
  await Column.findByIdAndUpdate(columnId, { $push: { cardIds: card._id } });

  return success(card, 201);
};

export const updateCardService = async ({
  cardId,
  title,
  description,
  dueDate,
  tags,
  assigneeId,
}) => {
  if (!isValidObjectId(cardId)) {
    return failure(400, cardMessages.invalidId);
  }

  // validate assignee is:
  // (1) valid user and (2) member of the card's board
  if (assigneeId !== undefined && assigneeId !== null) {
    if (!isValidObjectId(assigneeId)) {
      return failure(400, userMessages.invalidId);
    }
    const card = await Card.findById(cardId);
    if (!card) return failure(404, cardMessages.notFound);

    const board = await Board.findById(card.boardId);
    if (!board.memberIds.some((id) => id.toString() === assigneeId)) {
      return failure(400, boardMessages.assigneeNotMember);
    }
  }

  // better method if changing signature to recieve data:
  // const allowed = ["title", "description", "dueDate", "tags", "assigneeId"];
  // const updates = Object.fromEntries(
  //   allowed
  //     .filter((key) => data[key] !== undefined)
  //     .map((key) => [key, data[key]]),
  // );

  const updates = {};

  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (dueDate !== undefined) updates.dueDate = dueDate;
  if (tags !== undefined) updates.tags = tags;
  if (assigneeId !== undefined) updates.assigneeId = assigneeId;

  if (Object.keys(updates).length === 0) {
    return failure(400, cardMessages.noFieldsToUpdate);
  }

  const updated = await Card.findByIdAndUpdate(cardId, updates, {
    new: true,
  }).populate("assigneeId", "username email");
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

  // Remove from column's cardIds
  await Column.findByIdAndUpdate(deleted.columnId, {
    $pull: { cardIds: deleted._id },
  });

  return success(deleted);
};

// cross column move
export const moveCardService = async ({
  cardId,
  sourceColumnId,
  destinationColumnId,
  sourceCardIds,
  destinationCardIds,
}) => {
  if (!isValidObjectId(cardId)) {
    return failure(400, cardMessages.invalidId);
  }

  if (
    !isValidObjectId(sourceColumnId) ||
    !isValidObjectId(destinationColumnId)
  ) {
    return failure(400, columnMessages.invalidId);
  }

  const card = await Card.findById(cardId);
  if (!card) {
    return failure(404, cardMessages.notFound);
  }

  const destinationColumn = await Column.findOne({
    _id: destinationColumnId,
    boardId: card.boardId,
  });
  if (!destinationColumn) {
    return failure(400, cardMessages.invalidTargetColumn);
  }

  await Column.findByIdAndUpdate(sourceColumnId, {
    $set: { cardIds: sourceCardIds },
  });

  await Column.findByIdAndUpdate(destinationColumnId, {
    $set: { cardIds: destinationCardIds },
  });

  await Card.findByIdAndUpdate(cardId, {
    $set: { columnId: destinationColumnId },
  });

  return success({ cardId, sourceColumnId, destinationColumnId });
};
