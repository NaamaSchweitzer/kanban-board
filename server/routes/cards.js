import { Router } from "express";
import {
  getCardById,
  createCard,
  listCardsByBoard,
  listCardsByColumn,
  updateCard,
  deleteCard,
  moveCard,
} from "../controllers/cards.js";
import { cardMessages } from "../constants/messages.js";
import { serverResponse } from "../utils/serverResponse.js";

const router = Router();

// /cards?boardId=... OR /cards?columnId=...
router.get("/", async (req, res) => {
  if (req.query.columnId) return listCardsByColumn(req, res);
  else if (req.query.boardId) return listCardsByBoard(req, res);
  else return serverResponse(res, 400, cardMessages.boardOrColumnQueryRequired);
});

router.post("/", createCard);
router.get("/:cardId", getCardById);
router.put("/:cardId", updateCard);
router.delete("/:cardId", deleteCard);

// Drag & drop card move/reorder
router.patch("/:cardId/move", moveCard);

export default router;
