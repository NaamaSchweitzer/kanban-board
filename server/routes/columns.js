import { Router } from "express";
import {
  listColumnsByBoard,
  createColumn,
  getColumnById,
  updateColumn,
  deleteColumn,
  reorderCards
} from "../controllers/columns.js";

const router = Router();

// /columns?boardId=...
router.get("/", listColumnsByBoard);

router.post("/", createColumn);
router.get("/:columnId", getColumnById);
router.put("/:columnId", updateColumn);
router.delete("/:columnId", deleteColumn);

// card drag within same column
router.patch("/:columnId/reorder-cards", reorderCards);

export default router;
