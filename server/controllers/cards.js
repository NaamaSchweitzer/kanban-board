import { Card } from "../models/Card.js";
import { Column } from "../models/Column.js";
import {
  createCardService,
  deleteCardService,
  getCardByIdService,
  listCardsByBoardService,
  listCardsByColumnService,
  updateCardService,
} from "../services/cards.js";
import { newPositionBetween } from "../utils/position.js";
import { serverResponse } from "../utils/serverResponse.js";

export const listCardsByBoard = async (req, res) => {
  try {
    const { boardId } = req.query;

    if (!boardId) {
      return serverResponse(res, 400, "boardId query param is required");
    }

    const cards = await listCardsByBoardService(boardId);
    return serverResponse(res, 200, cards);
  } catch (err) {
    console.error("listCardsByBoard error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const listCardsByColumn = async (req, res) => {
  try {
    const { columnId } = req.query;

    if (!columnId) {
      return serverResponse(res, 400, "columnId query param is required");
    }

    const cards = await listCardsByColumnService(columnId);
    return serverResponse(res, 200, cards);
  } catch (err) {
    console.error("listCardsByColumn error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await getCardByIdService(cardId);

    if (!card) {
      return serverResponse(res, 404, "Card not found");
    }

    return serverResponse(res, 200, card);
  } catch (err) {
    console.error("getCardById error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const createCard = async (req, res) => {
  try {
    const {
      boardId,
      columnId,
      title,
      description = null,
      dueDate = null,
    } = req.body;

    if (!boardId || !columnId || !title) {
      return serverResponse(res, 400, "boardId, columnId, title are required");
    }
    const card = await createCardService({
      boardId,
      columnId,
      title,
      description,
      dueDate,
    });
    if (!card) {
      return serverResponse(res, 404, "Board or column not found");
    }

    return serverResponse(res, 201, card);
  } catch (err) {
    console.error("createCard error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, dueDate } = req.body;

    const allowed = new Set(["title", "description", "dueDate"]);

    const incomingKeys = Object.keys(req.body);
    const invalidKeys = incomingKeys.filter((k) => !allowed.has(k));

    if (invalidKeys.length) {
      return serverResponse(
        res,
        400,
        `Invalid fields: ${invalidKeys.join(", ")}`,
      );
    }

    const updated = await updateCardService({
      cardId,
      title,
      description,
      dueDate,
    });

    if (!updated) {
      return serverResponse(res, 404, "Card not found or no fields to update");
    }

    return serverResponse(res, 200, updated);
  } catch (err) {
    console.error("updateCard error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const deleted = await deleteCardService(cardId);

    if (!deleted) {
      return serverResponse(res, 404, "Card not found");
    }

    return serverResponse(res, 200, { ok: true, deletedCardId: cardId });
  } catch (err) {
    console.error("deleteCard error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

/** req:
 * - params: cardId
 * - body: {
 *   toColumnId: string,
 *   beforeCardId?: string|null,
 *   afterCardId?: string|null
 * }
 */
export const moveCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { toColumnId, beforeCardId = null, afterCardId = null } = req.body;

    if (!toColumnId) return serverResponse(res, 400, "toColumnId is required");

    const card = await Card.findById(cardId);
    if (!card) return serverResponse(res, 404, "Card not found");

    // validate target column belongs to same board
    const targetCol = await Column.findOne({
      _id: toColumnId,
      boardId: card.boardId,
    }).lean();

    if (!targetCol) {
      return serverResponse(res, 400, "Target column not found in same board");
    }

    const beforeCard = beforeCardId
      ? await Card.findOne({ _id: beforeCardId, columnId: toColumnId }).lean()
      : null;

    const afterCard = afterCardId
      ? await Card.findOne({ _id: afterCardId, columnId: toColumnId }).lean()
      : null;

    const newPos = newPositionBetween(
      beforeCard?.position ?? null,
      afterCard?.position ?? null,
    );

    card.columnId = toColumnId;
    card.position = newPos;
    await card.save();

    return serverResponse(res, 200, card);
  } catch (err) {
    console.error("moveCard error:", err);
    return serverResponse(res, 500, "Server error");
  }
};
