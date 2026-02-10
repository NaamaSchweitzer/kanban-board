import { Router } from "express";
import {
  listColumnsByBoard,
  createColumn,
  getColumnById,
  updateColumn,
  deleteColumn,
  moveColumn
} from "../controllers/columns.js";

const router = Router();

// /columns?boardId=...
router.get("/", listColumnsByBoard);

router.post("/", createColumn);
router.get("/:columnId", getColumnById);
router.put("/:columnId", updateColumn);
router.delete("/:columnId", deleteColumn);

// Drag & drop reorder columns
router.patch("/:columnId/move", moveColumn);

export default router;
