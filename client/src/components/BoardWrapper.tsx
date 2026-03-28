import { Box, useTheme } from "@mui/material";
import { useBoard } from "../hooks/useBoard";
import Board from "./Board";
import BoardMenuBar from "./BoardMenuBar";

interface BoardWrapperProps {
  boardId: string;
}

const BoardWrapper = ({ boardId }: BoardWrapperProps) => {
  const board = useBoard(boardId);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const boardColor = board.boardState?.board.color;

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...(boardColor && !isDark && { bgcolor: boardColor }),
      }}
    >
      <BoardMenuBar
        boardState={board.boardState}
        onUpdateBoard={board.updateBoard}
      />
      <Board board={board} />
    </Box>
  );
};

export default BoardWrapper;
