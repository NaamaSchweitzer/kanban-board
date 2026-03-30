import { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../../api/kanban";
import type { Board } from "../../types/kanban";
import { useAuth } from "../../contexts/AuthContext";
import CreateBoardModal from "../../components/CreateBoardModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import BoardCard from "../../components/BoardCard";

const Home = () => {
  const { user } = useAuth();

  const [isCreating, setIsCreating] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

  const queryClient = useQueryClient();

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

  const {
    data: sharedBoards = [],
    isLoading: isSharedLoading,
    isError: isSharedError,
    error: sharedError,
  } = useQuery({
    queryKey: ["boards", "shared", user?._id],
    queryFn: () => api.listMemberBoards(user!._id),
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

  if (isLoading || isSharedLoading)
    return <Typography sx={{ p: 4 }}>Loading boards...</Typography>;
  if (isError)
    return <Typography sx={{ p: 4 }}>Error: {error.message}</Typography>;
  if (isSharedError)
    return <Typography sx={{ p: 4 }}>Error: {sharedError.message}</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
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
          My Boards
        </Typography>
        <Button variant="contained" onClick={() => setIsCreating(true)}>
          Create new board
        </Button>
      </Box>

      {/* Owner Boards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 2,
        }}
      >
        {boards.map((board: Board) => (
          <BoardCard
            key={String(board._id)}
            board={board}
            onDelete={() => setBoardToDelete(board)}
          />
        ))}
      </Box>
      {boards.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
          No boards yet. Create one to get started.
        </Typography>
      )}

      {/* Shared Boards */}
      {sharedBoards.length > 0 && (
        <>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="secondary"
            gutterBottom
            sx={{ mt: 4 }}
          >
            Shared with me
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 2,
            }}
          >
            {sharedBoards.map((board: Board) => (
              <BoardCard key={String(board._id)} board={board} />
            ))}
          </Box>
        </>
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
