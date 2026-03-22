import type { UniqueIdentifier } from "@dnd-kit/core";

export type Id = UniqueIdentifier; // string | number

export interface Board {
  _id: Id;
  name: string;
  description: string | null;
  ownerId: Id;
  columnIds: Id[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  _id: Id;
  title: string;
  boardId: Id;
  cardIds: Id[];
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: Id;
  title: string;
  description: string | null;
  dueDate: string | null;
  columnId: Id;
  boardId: Id;
  createdAt: string;
  updatedAt: string;
}

export interface BoardState {
  board: Board;
  columns: Record<Id, Column>; // keyed by _id for O(1) lookup
  cards: Record<Id, Card>; // keyed by _id for O(1) lookup
}

export interface DraggableCardData {
  type: "card";
  card: Card;
  columnId: Id;
}

export interface DraggableColumnData {
  type: "column";
  column: Column;
}

export type DraggableData = DraggableCardData | DraggableColumnData;

export interface ReorderColumnsPayload {
  boardId: Id;
  columnIds: Id[];
}

export interface ReorderCardsPayload {
  columnId: Id;
  cardIds: Id[];
}

export interface MoveCardPayload {
  cardId: Id;
  sourceColumnId: Id;
  destinationColumnId: Id;
  sourceCardIds: Id[];
  destinationCardIds: Id[];
}