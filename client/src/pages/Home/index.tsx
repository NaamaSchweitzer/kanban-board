import { useState } from "react";
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
  useTheme,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../../api/kanban";
import type { Board } from "../../types/kanban";
import { useAuth } from "../../contexts/AuthContext";
import CreateBoardModal from "../../components/CreateBoardModal";
import ConfirmationModal from "../../components/ConfirmationModal";

const Home = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    data: boards = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["boards", user?._id],
    queryFn: () => api.listBoards(user!._id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description: string; color: string }) =>
      api.createBoard({ ...data, ownerId: user!._id }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["boards", user?._id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (boardId: string) => api.deleteBoard(boardId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["boards", user?._id] }),
  });

  const handleCreateBoard = async (
    name: string,
    description: string,
    color: string,
  ) => {
    await createMutation.mutateAsync({ name, description, color });
    setIsCreating(false);
  };

  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;
    await deleteMutation.mutateAsync(boardToDelete._id as string);
    setBoardToDelete(null);
  };

  if (isLoading)
    return <Typography sx={{ p: 4 }}>Loading boards...</Typography>;
  if (isError)
    return <Typography sx={{ p: 4 }}>Error: {error.message}</Typography>;

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

      {/* Boards List */}
      {/* <Grid size={{ xs: 12 }}> */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 2,
        }}
      >
        {boards.map((board: Board) => (
          /* Board Card */
          <Card
            key={String(board._id)}
            elevation={2}
            sx={{
              ...(board.color && !isDark && { bgcolor: board.color }),
              ...(board.color && isDark && { borderLeft: `4px solid ${board.color}` }),
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
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBoardToDelete(board);
                  }}
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

      {/* Delete Board Confirmation Modal */}
      <ConfirmationModal
        open={!!boardToDelete}
        title="Delete board"
        message={`Are you sure you want to delete "${boardToDelete?.name}"? All columns and cards within it will be lost.`}
        onConfirm={handleDeleteBoard}
        onCancel={() => setBoardToDelete(null)}
      />
    </Container>
  );
};

export default Home;
