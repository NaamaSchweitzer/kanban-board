import { useState } from "react";
import { TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import type { BoardState } from "../types/kanban";

interface BoardMenuBarProps {
  boardState: BoardState | null;
  onUpdateBoard: (data: {
    name?: string;
    description?: string;
  }) => Promise<void>;
}

const BoardMenuBar = ({ boardState, onUpdateBoard }: BoardMenuBarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  if (!boardState) return null;

  const { board } = boardState;

  const handleStartEditing = () => {
    setEditName(board.name);
    setIsEditing(true);
  };

  const handleSubmit = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== board.name) {
      onUpdateBoard({ name: trimmed });
    }
    setIsEditing(false);
  };

  return (
    <Toolbar
      sx={{
        height: (theme) => theme.heightVariants.boardBarHeight,
      }}
    >
      {/* Editable Board Name */}
      {isEditing ? (
        <TextField
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") setIsEditing(false);
          }}
          variant="standard"
          autoFocus
          sx={{ minWidth: 200 }}
        />
      ) : (
        <Tooltip title="Click to rename board" arrow>
          <Typography
            variant="h5"
            onClick={handleStartEditing}
            sx={{
              p: 0.5,
              borderRadius: 1,
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor: (theme) => theme.palette.action.hover,
                cursor: "pointer",
              },
            }}
          >
            {board.name}
          </Typography>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default BoardMenuBar;
