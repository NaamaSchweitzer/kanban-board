import jwt from "jsonwebtoken";
import "dotenv/config";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";

export const verifyToken = (req, res, next) => {
  // Extract "Bearer TOKEN"
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub, email, iat, exp }
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

// Ensures the authenticated user can only act on their own resources
export const verifyOwnership = (req, res, next) => {
  const { userId } = req.params;
  if (req.user.sub !== userId) {
    return res.status(403).json({ message: "Forbidden - Not your resource" });
  }
  next();
};

// Ensures the authenticated user is the owner of the board 
export const verifyBoardOwner = async (req, res, next) => {
  const { boardId } = req.params;

  const board = await Board.findById(boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  const isOwner = board.ownerId.toString() === req.user.sub;
  if (!isOwner) {
    return res
      .status(403)
      .json({ message: "Only the board owner can do this" });
  }

  next();
};

// Ensures the authenticated user is a member of the board
export const verifyBoardMember = async (req, res, next) => {
  const { boardId } = req.params;

  const board = await Board.findById(boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  const isMember = board.members.some((id) => id.toString() === req.user.sub);
  if (!isMember) {
    return res
      .status(403)
      .json({ message: "You are not a member of this board" });
  }

  next();
};

// Ensures the authenticated user is a member of the owning board
export const verifyColumnAccess = async (req, res, next) => {
  const { columnId } = req.params;
  const column = await Column.findById(columnId);
  if (!column) return res.status(404).json({ message: "Column not found" });

  const board = await Board.findById(column.boardId);

  const isMember = board.members.some((id) => id.toString() === req.user.sub);
  if (!isMember) {
    return res
      .status(403)
      .json({ message: "You are not a member of this board" });
  }

  next();
};

// Ensures the authenticated user is a member of the owning board
export const verifyCardAccess = async (req, res, next) => {
  const { cardId } = req.params;
  const card = await Card.findById(cardId);
  if (!card) return res.status(404).json({ message: "Card not found" });

  const board = await Board.findById(card.boardId);

  const isMember = board.members.some((id) => id.toString() === req.user.sub);
  if (!isMember) {
    return res
      .status(403)
      .json({ message: "You are not a member of this board" });
  }

  next();
};