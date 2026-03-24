import { type ReactNode, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, DeleteOutline } from "@mui/icons-material";
import type { Column, Id } from "../types/kanban";
import { useTheme } from "../contexts/ThemeContext";
import CardCreationForm, { type CardFormData } from "./CardCreationForm";
import ConfirmationModal from "./ConfirmationModal";

interface ColumnItemProps {
  column: Column;
  dragHandleProps?: Record<string, unknown>;
  onUpdateColumn?: (columnId: Id, title: string) => Promise<void>;
  onDeleteColumn?: (columnId: Id) => Promise<void>;
  onCreateCard?: (
    columnId: Id,
    data: { title: string; description?: string; dueDate?: string | null },
  ) => Promise<void>;
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { themeMode } = useTheme();

  const handleTitleSubmit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onUpdateColumn?.(column._id, trimmed);
    }
    setIsEditingTitle(false);
  };

  const handleAddCard = (data: CardFormData) => {
    onCreateCard?.(column._id, data);
    setIsAddingCard(false);
  };

  const handleDeleteList = () => {
    onDeleteColumn?.(column._id);
    setOpenDeleteModal(false);
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
            sx={{
              flex: 1,
              bgcolor: themeMode === "light" ? "white" : "background.paper.100",
            }}
          />
        ) : (
          <Tooltip title="Click to edit title" arrow>
            <Typography
              variant="subtitle1"
              onClick={() => setIsEditingTitle(true)}
              sx={{ flex: 1, cursor: "pointer" }}
            >
              {column.title}
            </Typography>
          </Tooltip>
        )}
        <IconButton size="small" onClick={() => setOpenDeleteModal(true)}>
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
        }}
      >
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
      </Box>

      <CardCreationForm
        open={isAddingCard}
        onClose={() => setIsAddingCard(false)}
        onSubmit={handleAddCard}
      />

      {/* Delete List Confirmation Modal */}
      <ConfirmationModal
        open={openDeleteModal}
        title="Delete list"
        message="Are you sure you want to delete this list? All tasks within it will be lost."
        onConfirm={handleDeleteList}
        onCancel={() => setOpenDeleteModal(false)}
      />
    </Paper>
  );
};

export default ColumnItem;
