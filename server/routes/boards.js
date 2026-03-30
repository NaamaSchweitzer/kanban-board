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
  listBoardsByMember,
} from "../controllers/boards.js";

const router = Router();

// GET /boards?ownerId=... OR /boards?userId=...
router.get("/", (req, res) => {
  if (req.query.userId) return listBoardsByMember(req, res);
  if (req.query.ownerId) return listBoardsByOwner(req, res);
  return res.status(400).json({ message: "ownerId or userId query param is required" });
});

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
