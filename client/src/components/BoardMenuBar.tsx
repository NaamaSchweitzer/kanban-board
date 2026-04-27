import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Popover,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Palette, PersonAdd } from "@mui/icons-material";
import type { BoardState, UpdateBoardData } from "../types/kanban";
import type { Filters } from "../utils/filters";
import ColorPicker from "./ColorPicker";
import ManageMembersPopover from "./ManageMembersPopover";
import FilterMenu from "./FilterMenu";
import { stringAvatar } from "../utils/avatar";

interface BoardMenuBarProps {
  boardState: BoardState | null;
  onUpdateBoard: (data: UpdateBoardData) => Promise<void>;
  onAddMember: (userId: string) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
  filters: Filters;
  onFiltersChange: (next: Filters) => void;
}

const BoardMenuBar = ({
  boardState,
  onUpdateBoard,
  onAddMember,
  onRemoveMember,
  filters,
  onFiltersChange,
}: BoardMenuBarProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);
  const [memberAnchor, setMemberAnchor] = useState<HTMLElement | null>(null);

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

  const handleColorChange = (color: string) => {
    onUpdateBoard({ color: color || null });
  };

  const fontColor = isDark && board.color ? board.color : undefined;

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
              color: fontColor,
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

      {/* Color Picker Button */}
      <Box sx={{ ml: 1 }}>
        <Tooltip title="Board color" arrow>
          <IconButton
            size="small"
            onClick={(e) => setColorAnchor(e.currentTarget)}
            sx={{ color: fontColor }}
          >
            <Palette fontSize="small" />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(colorAnchor)}
          anchorEl={colorAnchor}
          onClose={() => setColorAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 2, maxWidth: 280 }}>
            <ColorPicker
              value={board.color || ""}
              onChange={handleColorChange}
            />
          </Box>
        </Popover>
      </Box>

      {/* Filter Menu */}
      <Box sx={{ ml: 1 }}>
        <FilterMenu
          filters={filters}
          onChange={onFiltersChange}
          members={board.members ?? []}
          cards={Object.values(boardState.cards)}
        />
      </Box>

      {/* Board Members */}
      <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
        <AvatarGroup
          max={5}
          sx={{
            "& .MuiAvatar-root": { width: 32, height: 32, fontSize: 14 },
          }}
        >
          {board.members?.map((member) => (
            <Tooltip key={member._id} title={member.username} arrow>
              <Avatar {...stringAvatar(member.username)} />
            </Tooltip>
          ))}
        </AvatarGroup>

        <Tooltip title="Manage members" arrow>
          <IconButton
            size="small"
            onClick={(e) => setMemberAnchor(e.currentTarget)}
          >
            <PersonAdd fontSize="small" />
          </IconButton>
        </Tooltip>

        <ManageMembersPopover
          board={board}
          anchorEl={memberAnchor}
          onClose={() => setMemberAnchor(null)}
          onAddMember={onAddMember}
          onRemoveMember={onRemoveMember}
        />
      </Box>
    </Toolbar>
  );
};

export default BoardMenuBar;
