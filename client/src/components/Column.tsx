import { type ReactNode, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Add, CloseRounded, DeleteOutline } from "@mui/icons-material";
import type { Column, Id } from "../types/kanban";

interface ColumnItemProps {
  column: Column;
  dragHandleProps?: Record<string, unknown>;
  onUpdateColumn?: (columnId: Id, title: string) => Promise<void>;
  onDeleteColumn?: (columnId: Id) => Promise<void>;
  onCreateCard?: (columnId: Id, title: string) => Promise<void>;
  children: ReactNode;
}

const ColumnItem = ({
  column,
  dragHandleProps,
  onUpdateColumn,
  onDeleteColumn,
  onCreateCard,
  children,
}: ColumnItemProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleTitleSubmit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onUpdateColumn?.(column._id, trimmed);
    }
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onCreateCard?.(column._id, newCardTitle.trim());
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 250,
        maxWidth: 250,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? "#ececec"
            : theme.palette.background.paper,
      }}
    >
      {/* Header — drag handle */}
      <Box
        {...dragHandleProps}
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          cursor: dragHandleProps ? "grab" : undefined,
          height: (theme) => theme.heightVariants.listHeaderHeight,
        }}
      >
        {isEditingTitle ? (
          <TextField
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSubmit();
              if (e.key === "Escape") {
                setEditTitle(column.title);
                setIsEditingTitle(false);
              }
            }}
            size="small"
            autoFocus
            sx={{ flex: 1 }}
          />
        ) : (
          <Typography
            variant="subtitle1"
            onClick={() => setIsEditingTitle(true)}
            sx={{ flex: 1, cursor: "pointer" }}
          >
            {column.title}
          </Typography>
        )}
        <IconButton size="small" onClick={() => onDeleteColumn?.(column._id)}>
          <DeleteOutline />
        </IconButton>
      </Box>

      {/* Cards */}
      <Box
        sx={{
          p: children ? 1 : 0,
          pb: 0,
          overflowY: "auto",
          maxHeight: "280px",
          minHeight: 60,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          height: (theme) => theme.heightVariants.listFooterHeight,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isAddingCard ? (
          <Box sx={{ px: 1, pb: 1 }}>
            <TextField
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard();
                if (e.key === "Escape") {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }
              }}
              size="small"
              fullWidth
              autoFocus
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddCard}
                disabled={!newCardTitle.trim()}
              >
                Add card
              </Button>
              <IconButton
                size="small"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                <CloseRounded />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Button
            startIcon={<Add />}
            sx={{
              justifyContent: "flex-start",
              color: "text.secondary",
              py: 1,
              px: 2,
            }}
            fullWidth
            onClick={() => setIsAddingCard(true)}
          >
            Add a card
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ColumnItem;
