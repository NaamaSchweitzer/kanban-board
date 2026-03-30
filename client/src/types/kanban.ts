import type { UniqueIdentifier } from "@dnd-kit/core";

export type Id = UniqueIdentifier; // string | number

// ===================== MODELS =======================

export interface Member {
  _id: string;
  username: string;
  email: string;
}

export interface Board {
  _id: Id;
  name: string;
  description: string | null;
  color: string | null;
  ownerId: Id;
  members: Member[]; // populated memberIds
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

export interface Tag {
  label: string;
  color: string;
}

export interface Card {
  _id: Id;
  title: string;
  description: string | null;
  dueDate: string | null;
  tags: Tag[];
  columnId: Id;
  boardId: Id;
  assignee: Member | null; // populated
  createdAt: string;
  updatedAt: string;
}

export interface BoardState {
  board: Board;
  columns: Record<Id, Column>; // keyed by _id for O(1) lookup
  cards: Record<Id, Card>; // keyed by _id for O(1) lookup
}

// ===================== DTO ==========================

// crud types

export interface CreateBoardData {
  name: string;
  description?: string;
  color?: string;
  ownerId: string;
}

export interface UpdateBoardData {
  name?: string;
  description?: string;
  color?: string | null;
}

export interface CreateCardData {
  boardId: Id;
  columnId: Id;
  title: string;
  description?: string;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
  dueDate?: string | null;
  tags?: Tag[];
  assignee?: string | null; // user ID
}

// dnd types

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
