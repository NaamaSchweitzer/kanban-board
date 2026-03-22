import {
  createColumnService,
  deleteColumnService,
  getColumnByIdService,
  listColumnsByBoardService,
  updateColumnService,
  reorderCardsService,
} from "../services/columns.js";
import { columnMessages, commonMessages } from "../constants/messages.js";
import { serverResponse } from "../utils/serverResponse.js";

export const listColumnsByBoard = async (req, res) => {
  try {
    const { boardId } = req.query;

    if (!boardId) {
      return serverResponse(res, 400, columnMessages.boardIdQueryRequired);
    }

    const result = await listColumnsByBoardService(boardId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("listColumnsByBoard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const getColumnById = async (req, res) => {
  try {
    const { columnId } = req.params;

    const result = await getColumnByIdService(columnId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, result.data);
  } catch (err) {
    console.error("getColumnById error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const createColumn = async (req, res) => {
  try {
    const { boardId, title } = req.body;

    if (!title || !boardId)
      return serverResponse(res, 400, columnMessages.createRequiredFields);

    const result = await createColumnService({ title, boardId });
    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("createColumn error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const updateColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title } = req.body;

    const allowed = new Set(["title"]);

    const incomingKeys = Object.keys(req.body);
    const invalidKeys = incomingKeys.filter((k) => !allowed.has(k));

    if (invalidKeys.length) {
      return serverResponse(
        res,
        400,
        commonMessages.invalidFields(invalidKeys),
      );
    }

    const result = await updateColumnService({ columnId, title });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("updateColumn error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const result = await deleteColumnService(columnId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, { ok: true, deletedColumnId: columnId });
  } catch (err) {
    console.error("deleteColumn error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

// same column reorder
export const reorderCards = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { cardIds } = req.body;

    if (!Array.isArray(cardIds)) {
      return serverResponse(res, 400, columnMessages.cardIdsRequired);
    }

    const result = await reorderCardsService({ columnId, cardIds });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, result.data);
  } catch (err) {
    console.error("reorderCards error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};
