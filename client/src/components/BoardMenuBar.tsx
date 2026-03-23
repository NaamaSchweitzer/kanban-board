import { Toolbar, Typography } from "@mui/material";
import { useBoard } from "../hooks/useBoard";

interface BoardMenuBarProps {
  boardId: string;
}

const BoardMenuBar: React.FC<BoardMenuBarProps> = ({ boardId }) => {
  const { boardState } = useBoard(boardId);

  if (!boardState) return <div>Error board not found</div>;

  const { board } = boardState;

  return (
    <Toolbar
      sx={{
        height: (theme) => theme.heightVariants.boardBarHeight,
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        //   onClick={() => setIsEditing(true)}
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
    </Toolbar>
  );
};

export default BoardMenuBar;
