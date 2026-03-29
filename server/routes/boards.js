import { Router } from "express";
import {
  createBoard,
  listBoardsByOwner,
  getBoardById,
  updateBoard,
  deleteBoard,
  reorderColumns,
  addMember,
  removeMember,
} from "../controllers/boards.js";

const router = Router();

// POST /api/boards?ownerId=...
router.get("/", listBoardsByOwner);

router.post("/", createBoard);
router.get("/:boardId", getBoardById);
router.put("/:boardId", updateBoard);
router.delete("/:boardId", deleteBoard);

// column drag & drop
router.patch("/:boardId/reorder-columns", reorderColumns);

// board members
router.post("/:boardId/members", addMember);
router.delete("/:boardId/members/:userId", removeMember);

export default router;

/**
 * later ideas:
 *
 * // board metadata for frontend board page
 * router.get("/:boardId/metadata", getBoardMetadata);
 */
