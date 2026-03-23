import { useParams } from "react-router-dom";
import BoardWrapper from "../../components/BoardWrapper";
import Footer from "../../components/Footer";

const DashBoard = () => {
  const { boardId } = useParams();

  if (!boardId) return <div>Error 404 - Page Not Found</div>;

  return (
    <>
      <BoardWrapper boardId={boardId as string} />
      <Footer />
    </>
  );
};

export default DashBoard;
