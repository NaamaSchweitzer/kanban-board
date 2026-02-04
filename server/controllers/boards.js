import { serverResponse } from "../utils/serverResponse.js";
import {
  createBoardService,
  deleteBoardService,
  getBoardByIdService,
  listBoardsByOwnerService,
  updateBoardService,
} from "../services/boards.js";

export const listBoardsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return serverResponse(res, 400, "ownerId query param is required");
    }

    const boards = await listBoardsByOwnerService(ownerId);
    return serverResponse(res, 200, boards);
  } catch (err) {
    console.error("listBoardsByOwner error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const getBoardById = async (req, res) => {
  try {
    const { boardId } = req.params;

    const result = await getBoardByIdService(boardId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, result.data);
  } catch (err) {
    console.error("getBoardById error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const createBoard = async (req, res) => {
  try {
    const { name, description = null, ownerId } = req.body;

    if (!name || !ownerId)
      return serverResponse(res, 400, "name and ownerId are required");

    const board = await createBoardService({ name, description, ownerId });
    return serverResponse(res, 201, board);
  } catch (err) {
    console.error("createBoard error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name, description } = req.body;

    const allowed = new Set(["name", "description"]);

    const incomingKeys = Object.keys(req.body);
    const invalidKeys = incomingKeys.filter((k) => !allowed.has(k));

    if (invalidKeys.length) {
      return serverResponse(
        res,
        400,
        `Invalid fields: ${invalidKeys.join(", ")}`,
      );
    }

    const updated = await updateBoardService({
      boardId,
      name,
      description,
    });

    if (!updated) {
      return serverResponse(res, 404, "Board not found or no fields to update");
    }

    return serverResponse(res, 200, updated);
  } catch (err) {
    console.error("updateBoard error:", err);
    return serverResponse(res, 500, "Server error");
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await deleteBoardService(boardId);

    if (!board) {
      return serverResponse(res, 404, "Board not found");
    }

    return serverResponse(res, 200, { ok: true, deletedBoardId: boardId });
  } catch (err) {
    console.error("deleteBoard error:", err);
    return serverResponse(res, 500, "Server error");
  }
};
