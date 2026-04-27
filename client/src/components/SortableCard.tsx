import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  Card,
  DraggableCardData,
  Id,
  Member,
  UpdateCardData,
} from "../types/kanban";
import CardItem from "./Card";

interface SortableCardProps {
  card: Card;
  members: Member[];
  disabled?: boolean;
  onUpdateCard?: (cardId: Id, data: UpdateCardData) => Promise<void>;
  onDeleteCard?: (cardId: Id, columnId: Id) => Promise<void>;
}

const SortableCard = ({
  card,
  members,
  disabled,
  onUpdateCard,
  onDeleteCard,
}: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: {
      type: "card",
      card,
      columnId: card.columnId,
    } satisfies DraggableCardData,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardItem
        card={card}
        members={members}
        onUpdateCard={onUpdateCard}
        onDeleteCard={onDeleteCard}
      />
    </div>
  );
};

export default SortableCard;
