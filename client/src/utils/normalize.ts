import type { Board, Column, Card, BoardState } from "../types/kanban";

export const normalizeBoardData = (
  board: Board,
  columns: Column[],
  cards: Card[],
): BoardState => {
  return {
    board,
    columns: Object.fromEntries(columns.map((col) => [col._id, col])),
    cards: Object.fromEntries(cards.map((card) => [card._id, card])),
  };
};
