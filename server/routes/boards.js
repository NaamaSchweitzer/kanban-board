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
import { verifyBoardMember, verifyBoardOwner, verifyToken } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken);

// GET /boards?ownerId=... OR /boards?userId=...
router.get("/", (req, res) => {
  if (req.query.userId) return listBoardsByMember(req, res);
  if (req.query.ownerId) return listBoardsByOwner(req, res);
  return res.status(400).json({ message: "ownerId or userId query param is required" });
});

router.post("/", createBoard);
router.get("/:boardId", verifyBoardMember, getBoardById);
router.put("/:boardId", verifyBoardOwner, updateBoard);
router.delete("/:boardId", verifyBoardOwner, deleteBoard);

// column drag & drop
router.patch("/:boardId/reorder-columns", verifyBoardMember, reorderColumns);

// board members
router.post("/:boardId/members", verifyBoardOwner, addMember);
router.delete("/:boardId/members/:userId", verifyBoardOwner, removeMember);

export default router;

/**
 * later ideas:
 *
 * // board metadata for frontend board page
 * router.get("/:boardId/metadata", getBoardMetadata);
 */
