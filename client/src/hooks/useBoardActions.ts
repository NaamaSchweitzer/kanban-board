import { useCallback, type Dispatch, type SetStateAction } from "react";
import * as api from "../api/kanban";
import type { BoardState, Id } from "../types/kanban";

export function useBoardActions(
  boardId: string,
  setBoardState: Dispatch<SetStateAction<BoardState | null>>,
) {
  // ====================== COLUMNS ======================

  const createColumn = useCallback(
    async (title: string) => {
      const created = await api.createColumn({ title, boardId });
      setBoardState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          board: {
            ...prev.board,
            columnIds: [...prev.board.columnIds, created._id],
          },
          columns: {
            ...prev.columns,
            [created._id]: created,
          },
        };
      });
    },
    [boardId, setBoardState],
  );

  const updateColumn = useCallback(
    async (columnId: Id, title: string) => {
      const updated = await api.updateColumn(columnId, { title });
      setBoardState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [columnId]: { ...prev.columns[columnId], title: updated.title },
          },
        };
      });
    },
    [setBoardState],
  );

  const deleteColumn = useCallback(
    async (columnId: Id) => {
      await api.deleteColumn(columnId);
      setBoardState((prev) => {
        if (!prev) return prev;
        const cardIdsToRemove = prev.columns[columnId].cardIds;
        const newCards = { ...prev.cards };
        for (const cardId of cardIdsToRemove) {
          delete newCards[cardId];
        }
        const remainingColumns = Object.fromEntries(
          Object.entries(prev.columns).filter(([id]) => id !== columnId),
        );
        return {
          ...prev,
          board: {
            ...prev.board,
            columnIds: prev.board.columnIds.filter((id) => id !== columnId),
          },
          columns: remainingColumns,
          cards: newCards,
        };
      });
    },
    [setBoardState],
  );

  // ====================== CARDS ======================

  const createCard = useCallback(
    async (
      columnId: Id,
      data: { title: string; description?: string; dueDate?: string | null },
    ) => {
      const created = await api.createCard({ boardId, columnId, ...data });
      setBoardState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [columnId]: {
              ...prev.columns[columnId],
              cardIds: [...prev.columns[columnId].cardIds, created._id],
            },
          },
          cards: {
            ...prev.cards,
            [created._id]: created,
          },
        };
      });
    },
    [boardId, setBoardState],
  );

  const updateCard = useCallback(
    async (
      cardId: Id,
      data: { title?: string; description?: string; dueDate?: string | null },
    ) => {
      const updated = await api.updateCard(cardId, data);
      setBoardState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          cards: {
            ...prev.cards,
            [cardId]: { ...prev.cards[cardId], ...updated },
          },
        };
      });
    },
    [setBoardState],
  );

  const deleteCard = useCallback(
    async (cardId: Id, columnId: Id) => {
      await api.deleteCard(cardId);
      setBoardState((prev) => {
        if (!prev) return prev;
        const remainingCards = Object.fromEntries(
          Object.entries(prev.cards).filter(([id]) => id !== cardId),
        );
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [columnId]: {
              ...prev.columns[columnId],
              cardIds: prev.columns[columnId].cardIds.filter(
                (id) => id !== cardId,
              ),
            },
          },
          cards: remainingCards,
        };
      });
    },
    [setBoardState],
  );

  return {
    createColumn,
    updateColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
  };
}
