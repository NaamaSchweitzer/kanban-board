import { Router } from "express";
import {
  listColumnsByBoard,
  createColumn,
  getColumnById,
  updateColumn,
  deleteColumn,
  reorderCards,
} from "../controllers/columns.js";
import { verifyToken, verifyColumnAccess } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken);

// /columns?boardId=...
router.get("/", listColumnsByBoard);

router.post("/", createColumn);
router.get("/:columnId", verifyColumnAccess, getColumnById);
router.put("/:columnId", verifyColumnAccess, updateColumn);
router.delete("/:columnId", verifyColumnAccess, deleteColumn);

// card drag within same column
router.patch("/:columnId/reorder-cards", verifyColumnAccess, reorderCards);

export default router;
