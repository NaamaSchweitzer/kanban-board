import { boardMessages, commonMessages } from "../constants/messages.js";
import { serverResponse } from "../utils/serverResponse.js";
import {
  createBoardService,
  deleteBoardService,
  getBoardByIdService,
  listBoardsByOwnerService,
  updateBoardService,
  reorderColumnsService,
  addMemberService,
  removeMemberService,
} from "../services/boards.js";

export const listBoardsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return serverResponse(res, 400, boardMessages.ownerIdQueryRequired);
    }

    const result = await listBoardsByOwnerService(ownerId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("listBoardsByOwner error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
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
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const createBoard = async (req, res) => {
  try {
    const { name, description = null, color = null, ownerId } = req.body;

    if (!name || !ownerId)
      return serverResponse(res, 400, boardMessages.createRequiredFields);

    const result = await createBoardService({
      name,
      description,
      color,
      ownerId,
    });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("createBoard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name, description, color } = req.body;

    const allowed = new Set(["name", "description", "color"]);

    const incomingKeys = Object.keys(req.body);
    const invalidKeys = incomingKeys.filter((k) => !allowed.has(k));

    if (invalidKeys.length) {
      return serverResponse(
        res,
        400,
        commonMessages.invalidFields(invalidKeys),
      );
    }

    const result = await updateBoardService({
      boardId,
      name,
      description,
      color,
    });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, result.status, result.data);
  } catch (err) {
    console.error("updateBoard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const result = await deleteBoardService(boardId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, { ok: true, deletedBoardId: boardId });
  } catch (err) {
    console.error("deleteBoard error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const reorderColumns = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { columnIds } = req.body;

    if (!Array.isArray(columnIds)) {
      return serverResponse(res, 400, boardMessages.columnIdsRequired);
    }

    const result = await reorderColumnsService({ boardId, columnIds });

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, result.data);
  } catch (err) {
    console.error("reorderColumns error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const addMember = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return serverResponse(res, 400, boardMessages.memberRequired);
    }

    const result = await addMemberService(boardId, userId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, result.data);
  } catch (err) {
    console.error("addMember error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};

export const removeMember = async (req, res) => {
  try {
    const { boardId, userId } = req.params;

    const result = await removeMemberService(boardId, userId);

    if (!result.ok) {
      return serverResponse(res, result.status, result.message);
    }

    return serverResponse(res, 200, result.data);
  } catch (err) {
    console.error("removeMember error:", err);
    return serverResponse(res, 500, commonMessages.serverError);
  }
};
