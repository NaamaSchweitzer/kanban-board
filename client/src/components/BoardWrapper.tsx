import Board from "./Board";
import BoardMenuBar from "./BoardMenuBar";

interface BoardWrapperProps {
  boardId: string;
}

const BoardWrapper = ({ boardId }: BoardWrapperProps) => {
  return (
    <>
      <BoardMenuBar boardId={boardId} />
      <Board boardId={boardId} />
    </>
  );
};

export default BoardWrapper;
