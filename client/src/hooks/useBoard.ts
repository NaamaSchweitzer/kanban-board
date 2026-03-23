import { useState, useEffect, useCallback, useRef } from "react";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import * as api from "../api/kanban";
import { normalizeBoardData } from "../utils/normalize";
import { useBoardActions } from "./useBoardActions";
import type { BoardState, Card, Column, Id } from "../types/kanban";

export function useBoard(boardId: string) {
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const stateRef = useRef(boardState);
  const activeCardRef = useRef(activeCard);

  useEffect(() => {
    stateRef.current = boardState;
  }, [boardState]);

  useEffect(() => {
    activeCardRef.current = activeCard;
  }, [activeCard]);

  useEffect(() => {
    api
      .fetchBoard(boardId)
      .then(({ board, columns, cards }) => {
        setBoardState(normalizeBoardData(board, columns, cards));
      })
      .catch(console.error);
  }, [boardId]);

  // onDragStart
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "card") setActiveCard(data.card);
    if (data?.type === "column") setActiveColumn(data.column);
  }, []);

  // onDragOver
  // only fires for cross column card movement
  // gives the visual jump to the new column while still dragging
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !stateRef.current) return;

    if (active.data.current?.type !== "card") return;

    const activeColumnId = active.data.current.columnId;
    const overType = over.data.current?.type;

    const destColumnId: Id =
      overType === "column"
        ? over.id
        : overType === "card"
          ? over.data.current?.columnId
          : activeColumnId;

    if (activeColumnId === destColumnId) return;

    setBoardState((prev) => {
      if (!prev) return prev;

      // Guard: if card is already in destination (from a prior dragOver), skip
      if (prev.columns[destColumnId].cardIds.includes(active.id)) return prev;

      const sourceCardIds = prev.columns[activeColumnId].cardIds.filter(
        (id) => id !== active.id,
      );

      const destCardIds = [...prev.columns[destColumnId].cardIds];
      const overIndex =
        overType === "card" ? destCardIds.indexOf(over.id) : destCardIds.length;

      destCardIds.splice(overIndex, 0, active.id);

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [active.id]: {
            ...prev.cards[active.id],
            columnId: destColumnId,
          },
        },
        columns: {
          ...prev.columns,
          [activeColumnId]: {
            ...prev.columns[activeColumnId],
            cardIds: sourceCardIds,
          },
          [destColumnId]: {
            ...prev.columns[destColumnId],
            cardIds: destCardIds,
          },
        },
      };
    });
  }, []);

  // onDragEnd
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const currentCard = activeCardRef.current;
      setActiveCard(null);
      setActiveColumn(null);

      const { active, over } = event;
      const state = stateRef.current;
      if (!over || !state) return;

      const activeData = active.data.current;

      // Scenario 1: column reorder
      if (activeData?.type === "column") {
        if (active.id === over.id) return;

        const oldIndex = state.board.columnIds.indexOf(active.id);
        const newIndex = state.board.columnIds.indexOf(over.id);
        const newColumnIds = arrayMove(
          state.board.columnIds,
          oldIndex,
          newIndex,
        );

        const snapshot = state;
        setBoardState(
          (prev) =>
            prev && {
              ...prev,
              board: { ...prev.board, columnIds: newColumnIds },
            },
        );

        try {
          await api.reorderColumns({ boardId, columnIds: newColumnIds });
        } catch {
          setBoardState(snapshot);
        }
        return;
      }

      // Scenario 2: same column card reorder
      // Scenario 3: cross column card move
      if (activeData?.type === "card" && currentCard) {
        const overData = over.data.current;

        const destColumnId: Id =
          overData?.type === "column"
            ? over.id
            : overData?.type === "card"
              ? overData.columnId
              : currentCard.columnId;

        const snapshot = state;

        // Same column -> onDragOver didn't run, handle reorder here
        if (currentCard.columnId === destColumnId) {
          if (active.id === over.id) return;

          const oldIndex = state.columns[destColumnId].cardIds.indexOf(
            active.id,
          );
          const newIndex = state.columns[destColumnId].cardIds.indexOf(over.id);
          const newCardIds = arrayMove(
            state.columns[destColumnId].cardIds,
            oldIndex,
            newIndex,
          );

          setBoardState(
            (prev) =>
              prev && {
                ...prev,
                columns: {
                  ...prev.columns,
                  [destColumnId]: {
                    ...prev.columns[destColumnId],
                    cardIds: newCardIds,
                  },
                },
              },
          );

          try {
            await api.reorderCards({
              columnId: destColumnId,
              cardIds: newCardIds,
            });
          } catch {
            setBoardState(snapshot);
          }
          return;
        }

        // Cross column -> onDragOver already updated local state,
        // just read the final arrays and sync to server
        const sourceCardIds = state.columns[currentCard.columnId].cardIds;
        const destCardIds = state.columns[destColumnId].cardIds;

        try {
          await api.moveCard({
            cardId: active.id,
            sourceColumnId: currentCard.columnId,
            destinationColumnId: destColumnId,
            sourceCardIds,
            destinationCardIds: destCardIds,
          });
        } catch (err) {
          console.error("Move failed", err);
          setBoardState(snapshot);
        }
      }
    },
    [boardId],
  );

  const actions = useBoardActions(boardId, setBoardState);

  return {
    boardState,
    activeCard,
    activeColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    ...actions,
  };
}
