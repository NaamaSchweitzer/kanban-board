import {
  cardMessages,
  columnMessages,
  commonMessages,
} from "../constants/messages.js";
import {
  createCardService,
  deleteCardService,
  getCardByIdService,
  listCardsByBoardService,
  listCardsByColumnService,
  moveCardService,
  updateCardService,
} from "../services/cards.js";
import { serverResponse } from "../utils/serverResponse.js";

export const listCardsByBoard = async (req, res) => {
  try {
    const { boardId } = req.query;

    if (!boardId) {
      return serverResponse(res, 400, cardMessages.boardIdQueryRequired);
    }

    const result = await listCardsByBoardService(boardId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("listCardsByBoard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const listCardsByColumn = async (req, res) => {
  try {
    const { columnId } = req.query;

    if (!columnId) {
      return serverResponse(res, 400, cardMessages.columnIdQueryRequired);
    }

    const result = await listCardsByColumnService(columnId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("listCardsByColumn error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;

    const result = await getCardByIdService(cardId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("getCardById error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
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
      return serverResponse(res, 400, cardMessages.createRequiredFields);
    }

    const result = await createCardService({
      boardId,
      columnId,
      title,
      description,
      dueDate,
    });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("createCard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, dueDate, tags } = req.body;

    const allowed = new Set(["title", "description", "dueDate", "tags"]);

    const incomingKeys = Object.keys(req.body);
    const invalidKeys = incomingKeys.filter((k) => !allowed.has(k));

    if (invalidKeys.length) {
      return serverResponse(
        res,
        400,
        commonMessages.invalidFields(invalidKeys),
      );
    }

    const result = await updateCardService({
      cardId,
      title,
      description,
      dueDate,
      tags,
    });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("updateCard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const result = await deleteCardService(cardId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, { ok: true, deletedCardId: cardId });
  } catch (err) {
    console.error("deleteCard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

// cross column move
export const moveCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const {
      sourceColumnId,
      destinationColumnId,
      sourceCardIds,
      destinationCardIds,
    } = req.body;

    if (!sourceColumnId || !destinationColumnId) {
      return serverResponse(res, 400, cardMessages.moveRequiredFields);
    }

    if (!Array.isArray(sourceCardIds) || !Array.isArray(destinationCardIds)) {
      return serverResponse(res, 400, columnMessages.cardIdsRequired);
    }

    const result = await moveCardService({
      cardId,
      sourceColumnId,
      destinationColumnId,
      sourceCardIds,
      destinationCardIds,
    });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("moveCard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};
