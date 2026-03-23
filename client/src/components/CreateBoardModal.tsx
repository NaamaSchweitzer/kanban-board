import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, color: string) => void;
}

const CreateBoardModal = ({
  open,
  onClose,
  onCreate,
}: CreateBoardModalProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), description.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Board</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          {/* Board Name */}
          <TextField
            label="Board name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            fullWidth
            autoFocus
            required
            variant="outlined"
            sx={{ mt: 1 }}
          />

          {/* Board Description */}
          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleClose}>Cancel</Button> */}
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!name.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBoardModal;
