import { useParams } from "react-router-dom";

const DashBoard = () => {
  const { boardId } = useParams();
  return <div>DashBoard Page {boardId}</div>;
};

export default DashBoard;
