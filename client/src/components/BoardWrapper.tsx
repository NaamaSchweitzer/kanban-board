import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { useBoard } from "../hooks/useBoard";
import { defaultFilters, type Filters } from "../utils/filters";
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

  const [filters, setFilters] = useState<Filters>(defaultFilters);

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
        onAddMember={board.addMember}
        onRemoveMember={board.removeMember}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <Board board={board} filters={filters} />
    </Box>
  );
};

export default BoardWrapper;
