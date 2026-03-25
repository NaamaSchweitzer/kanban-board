import { Box } from "@mui/material";
import { useBoard } from "../hooks/useBoard";
import Board from "./Board";
import BoardMenuBar from "./BoardMenuBar";

interface BoardWrapperProps {
  boardId: string;
}

const BoardWrapper = ({ boardId }: BoardWrapperProps) => {
  const board = useBoard(boardId);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
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
