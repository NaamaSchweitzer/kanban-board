import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  //   closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Stack } from "@mui/material";
import { createPortal } from "react-dom";
import type { useBoard } from "../hooks/useBoard";
import SortableColumn from "./SortableColumn";
import CardItem from "./Card";
import ColumnItem from "./Column";
import AddNewColumn from "./AddNewColumn";

interface BoardProps {
  board: ReturnType<typeof useBoard>;
}

const Board = ({ board }: BoardProps) => {
  const {
    boardState,
    activeCard,
    activeColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    createColumn,
    updateColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
  } = board;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  if (!boardState) return <div>Loading...</div>;

  const { board: boardData, columns, cards } = boardState;
  const orderedColumns = boardData.columnIds.map((id) => columns[id]);

  return (
    <Box sx={{ p: 1, px: 2, flex: 1, overflow: "auto" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          height: "100%",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          //   collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={boardData.columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {orderedColumns.map((col) => (
              <SortableColumn
                key={col._id}
                column={col}
                cards={col.cardIds.map((id) => cards[id]).filter(Boolean)}
                members={boardData.members ?? []}
                onUpdateColumn={updateColumn}
                onDeleteColumn={deleteColumn}
                onCreateCard={createCard}
                onUpdateCard={updateCard}
                onDeleteCard={deleteCard}
              />
            ))}
          </SortableContext>

          {createPortal(
            <DragOverlay>
              {activeCard && <CardItem card={activeCard} isDragging={true} />}
              {activeColumn && (
                <ColumnItem column={activeColumn}>{null}</ColumnItem>
              )}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>

        <AddNewColumn onCreateColumn={createColumn} />
      </Stack>
    </Box>
  );
};

export default Board;
