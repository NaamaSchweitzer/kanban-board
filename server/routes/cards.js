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
import { verifyToken, verifyCardAccess } from "../middleware/auth.js";

const router = Router();

router.use(verifyToken);

// /cards?boardId=... OR /cards?columnId=...
router.get("/", async (req, res) => {
  if (req.query.columnId) return listCardsByColumn(req, res);
  else if (req.query.boardId) return listCardsByBoard(req, res);
  else return serverResponse(res, 400, cardMessages.boardOrColumnQueryRequired);
});

router.post("/", createCard);
router.get("/:cardId", verifyCardAccess, getCardById);
router.put("/:cardId", verifyCardAccess, updateCard);
router.delete("/:cardId", verifyCardAccess, deleteCard);

// card drag across columns
router.patch("/:cardId/move", verifyCardAccess, moveCard);

export default router;
