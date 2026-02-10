import { Router } from "express";
import {
  createBoard,
  listBoardsByOwner,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/boards.js";

const router = Router();

// /boards?ownerId=...
router.get("/", listBoardsByOwner);

router.post("/", createBoard);
router.get("/:boardId", getBoardById);
router.put("/:boardId", updateBoard);
router.delete("/:boardId", deleteBoard);

export default router;

/**
 * later ideas:
 * 
 * // board metadata for frontend board page
 * router.get("/:boardId/metadata", getBoardMetadata);
 */
