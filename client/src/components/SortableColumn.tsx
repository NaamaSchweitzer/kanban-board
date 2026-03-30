import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  Card,
  Column,
  DraggableColumnData,
  Id,
  Member,
  UpdateCardData,
} from "../types/kanban";
import ColumnItem from "./Column";
import SortableCard from "./SortableCard";

interface SortableColumnProps {
  column: Column;
  cards: Card[];
  members: Member[];
  onUpdateColumn: (columnId: Id, title: string) => Promise<void>;
  onDeleteColumn: (columnId: Id) => Promise<void>;
  onCreateCard: (
    columnId: Id,
    data: { title: string; description?: string; dueDate?: string | null },
  ) => Promise<void>;
  onUpdateCard: (cardId: Id, data: UpdateCardData) => Promise<void>;
  onDeleteCard: (cardId: Id, columnId: Id) => Promise<void>;
}

const SortableColumn = ({
  column,
  cards,
  members,
  onUpdateColumn,
  onDeleteColumn,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
}: SortableColumnProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { type: "column", column } satisfies DraggableColumnData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ColumnItem
        column={column}
        dragHandleProps={{ ...attributes, ...listeners }}
        onUpdateColumn={onUpdateColumn}
        onDeleteColumn={onDeleteColumn}
        onCreateCard={onCreateCard}
      >
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <SortableCard
              key={card._id}
              card={card}
              members={members}
              onUpdateCard={onUpdateCard}
              onDeleteCard={onDeleteCard}
            />
          ))}
        </SortableContext>
      </ColumnItem>
    </div>
  );
};

export default SortableColumn;
