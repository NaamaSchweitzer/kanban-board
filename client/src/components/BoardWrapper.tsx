import { useBoard } from "../hooks/useBoard";
import Board from "./Board";
import BoardMenuBar from "./BoardMenuBar";

interface BoardWrapperProps {
  boardId: string;
}

const BoardWrapper = ({ boardId }: BoardWrapperProps) => {
  const board = useBoard(boardId);

  return (
    <>
      <BoardMenuBar
        boardState={board.boardState}
        onUpdateBoard={board.updateBoard}
      />
      <Board board={board} />
    </>
  );
};

export default BoardWrapper;
