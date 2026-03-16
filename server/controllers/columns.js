import {
  createColumnService,
  deleteColumnService,
  getColumnByIdService,
  listColumnsByBoardService,
  updateColumnService,
} from "../services/columns.js";
import { Column } from "../models/Column.js";
import { serverResponse } from "../utils/serverResponse.js";
import {
  isPositionGapTight,
  newPositionBetween,
  rebalancePositions,
} from "../utils/position.js";

export const listColumnsByBoard = async (req, res) => {
  try {
    const { boardId } = req.query;

    if (!boardId) {
      return serverResponse(res, 400, "boardId query param is required");
    }

    const columns = await listColumnsByBoardService(boardId);
    return serverResponse(res, 200, columns);
  } catch (err) {
    console.error("listColumnsByBoard error:", err);
    return serverResponse(res, 500, "Server error");
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
    return serverResponse(res, 500, "Server error");
  }
};

export const createColumn = async (req, res) => {
  try {
    const { boardId, title } = req.body;

    if (!title || !boardId)
      return serverResponse(res, 400, "title and boardId are required");

    const column = await createColumnService({ title, boardId });
    if (!column) {
      return serverResponse(res, 404, "Board not found");
    }

    return serverResponse(res, 201, column);
  } catch (err) {
    console.error("createColumn error:", err);
    return serverResponse(res, 500, "Server error");
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
        `Invalid fields: ${invalidKeys.join(", ")}`,
      );
    }

    const updated = await updateColumnService({ columnId, title });

    if (!updated) {
      return serverResponse(
        res,
        404,
        "Column not found or no fields to update",
      );
    }

    return serverResponse(res, 200, updated);
  } catch (err) {
    console.error("updateColumn error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const deleted = await deleteColumnService(columnId);

    if (!deleted) {
      return serverResponse(res, 404, "Column not found");
    }

    return serverResponse(res, 200, { ok: true, deletedColumnId: columnId });
  } catch (err) {
    console.error("deleteColumn error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

/** About moveColumn logic:
 * gets in request:
 * - param: columnId
 * - body: { beforeColumnId?: string|null, afterColumnId?: string|null }
 * columnId - the column to move
 * beforeColumnId/afterColumnId can also be null to indicate an end/start
 * result:
 * the order should be changed from orginally being [..., beforeColumnId, afterColumnId,...]
 * to the order: [..., beforeColumnId, columnId, afterColumnId,...]
 */
export const moveColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { beforeColumnId = null, afterColumnId = null } = req.body;

    if (beforeColumnId && beforeColumnId === afterColumnId) {
      return serverResponse(
        res,
        400,
        "beforeColumnId and afterColumnId cannot be the same",
      );
    }

    if (columnId === beforeColumnId || columnId === afterColumnId) {
      return serverResponse(res, 400, "Moved column cannot also be a neighbor");
    }

    const column = await Column.findById(columnId);
    if (!column) {
      return serverResponse(res, 404, "Column not found");
    }

    // Ensure neighbors are on same board
    const boardId = column.boardId;

    const before = beforeColumnId
      ? await Column.findOne({ _id: beforeColumnId, boardId }).lean()
      : null;

    const after = afterColumnId
      ? await Column.findOne({ _id: afterColumnId, boardId }).lean()
      : null;

    if (beforeColumnId && !before) {
      return serverResponse(
        res,
        400,
        "beforeColumnId is invalid for this board",
      );
    }

    if (afterColumnId && !after) {
      return serverResponse(
        res,
        400,
        "afterColumnId is invalid for this board",
      );
    }

    if (before && after && before.position >= after.position) {
      return serverResponse(
        res,
        400,
        "Neighbor columns are not in a valid order",
      );
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

    const newPos = newPositionBetween(
      refreshedBefore?.position ?? before?.position ?? null,
      refreshedAfter?.position ?? after?.position ?? null,
    );

    column.position = newPos;
    await column.save();

    return serverResponse(res, 200, column);
  } catch (err) {
    console.error("moveColumn error:", err);
    return serverResponse(res, 500, "Server error");
  }
};
