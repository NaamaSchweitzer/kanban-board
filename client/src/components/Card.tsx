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
import ConfirmationModal from "./ConfirmationModal";
import ExpandedCard from "./ExpandedCard";
import { useState } from "react";

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
  onUpdateCard,
  onDeleteCard,
}: CardItemProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openExpanded, setOpenExpanded] = useState(false);

  const handleDelete = () => {
    onDeleteCard?.(card._id, card.columnId);
    setOpenDeleteModal(false);
    setOpenExpanded(false);
  };

  return (
    <>
      <MuiCard
        elevation={3}
        sx={{ mb: 1, opacity: isDragging ? 0.5 : undefined, cursor: "grab" }}
      >
        <CardActionArea onClick={() => setOpenExpanded(true)}>
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
                  setOpenDeleteModal(true);
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

      {/* Delete Card Confirmation Modal */}
      <ConfirmationModal
        open={openDeleteModal}
        title="Delete card"
        message={`Are you sure you want to delete "${card.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setOpenDeleteModal(false)}
      />

      {/* Expanded Card Drawer */}
      {onUpdateCard && openExpanded && (
        <ExpandedCard
          card={card}
          open={openExpanded}
          onClose={() => setOpenExpanded(false)}
          onUpdateCard={onUpdateCard}
          onDeleteCard={() => setOpenDeleteModal(true)}
        />
      )}
    </>
  );
};

export default CardItem;
