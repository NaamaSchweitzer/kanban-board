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
  onUpdateCard?: (cardId: Id, data: UpdateCardData) => Promise<void>;
  onDeleteCard?: (cardId: Id, columnId: Id) => Promise<void>;
}

const SortableCard = ({
  card,
  members,
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
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
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
