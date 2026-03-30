import { useNavigate } from "react-router-dom";
import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import type { Board } from "../types/kanban";

interface BoardCardProps {
  board: Board;
  onDelete?: () => void;
}

const BoardCard = ({ board, onDelete }: BoardCardProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      elevation={2}
      sx={{
        ...(board.color && !isDark && { bgcolor: board.color }),
        ...(board.color &&
          isDark && { borderLeft: `4px solid ${board.color}` }),
      }}
    >
      <CardActionArea onClick={() => navigate(`/dashboard/${board._id}`)}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "flex-start",
            minHeight: 100,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{board.name}</Typography>
            {board.description && (
              <Typography variant="body2" color="text.secondary">
                {board.description}
              </Typography>
            )}
          </Box>

          {/* Delete Button */}
          {onDelete && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BoardCard;
