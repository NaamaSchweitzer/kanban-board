import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import * as api from "../../api/kanban";
import type { Board } from "../../types/kanban";
import { useAuth } from "../../contexts/AuthContext";
import CreateBoardModal from "../../components/CreateBoardModal";

const Home = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    api.listBoards(user._id).then(setBoards).catch(console.error);
  }, [user]);

  const handleCreateBoard = async (name: string, description: string) => {
    if (!user) return;
    const created = await api.createBoard({
      name,
      description,
      ownerId: user._id,
    });
    // addBoard
    setBoards((prev) => [...prev, created]);
  };

  const handleDeleteBoard = async (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.deleteBoard(boardId);
    setBoards((prev) => prev.filter((b) => b._id !== boardId));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="semi-bold"
          color="text.secondary"
          gutterBottom
        >
          Your Boards
        </Typography>
        <Button variant="contained" onClick={() => setIsCreating(true)}>
          Create new board
        </Button>
      </Box>

      {/* <Grid size={{ xs: 12 }}> */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 2,
        }}
      >
        {boards.map((board) => (
          <Card key={String(board._id)} elevation={2}>
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
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteBoard(board._id as string, e)}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      {/* </Grid> */}

      {boards.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
          No boards yet. Create one to get started.
        </Typography>
      )}

      {/* Create Board Dialog */}
      <CreateBoardModal
        open={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={handleCreateBoard}
      />
    </Container>
  );
};

export default Home;
