import {
  CardActionArea,
  CardContent,
  Card as MuiCard,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import type { Card, Id } from "../types/kanban";

interface CardItemProps {
  card: Card;
  isDragging?: boolean;
  onUpdateCard?: (
    cardId: Id,
    data: { title?: string; description?: string; dueDate?: string | null },
  ) => Promise<void>;
  onDeleteCard?: (cardId: Id, columnId: Id) => Promise<void>;
}

const CardItem = ({
  card,
  isDragging = false,
  onDeleteCard,
}: CardItemProps) => {
  return (
    <MuiCard
      elevation={3}
      sx={{ mb: 1, opacity: isDragging ? 0.5 : undefined, cursor: "grab" }}
    >
      <CardActionArea>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            "&:last-child": { pb: 2 },
          }}
        >
          <Typography variant="subtitle1" sx={{ flex: 1 }}>
            {card.title}
          </Typography>
          {onDeleteCard && (
            <Box
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCard(card._id, card.columnId);
              }}
            >
              <IconButton size="small">
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </MuiCard>
  );
};

export default CardItem;
