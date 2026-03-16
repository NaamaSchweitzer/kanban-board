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
import {
  isPositionGapTight,
  newPositionBetween,
  rebalancePositions,
} from "../utils/position.js";
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

    if (beforeCardId && beforeCardId === afterCardId) {
      return serverResponse(
        res,
        400,
        "beforeCardId and afterCardId cannot be the same",
      );
    }

    if (cardId === beforeCardId || cardId === afterCardId) {
      return serverResponse(res, 400, "Moved card cannot also be a neighbor");
    }

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

    if (beforeCardId && !beforeCard) {
      return serverResponse(
        res,
        400,
        "beforeCardId is invalid for target column",
      );
    }

    if (afterCardId && !afterCard) {
      return serverResponse(
        res,
        400,
        "afterCardId is invalid for target column",
      );
    }

    if (beforeCard && afterCard && beforeCard.position >= afterCard.position) {
      return serverResponse(
        res,
        400,
        "Neighbor cards are not in a valid order",
      );
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

    const newPos = newPositionBetween(
      refreshedBeforeCard?.position ?? beforeCard?.position ?? null,
      refreshedAfterCard?.position ?? afterCard?.position ?? null,
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
