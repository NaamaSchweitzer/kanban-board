import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ColorPicker from "./ColorPicker";

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, color: string) => void;
}

const CreateBoardModal = ({
  open,
  onClose,
  onCreate,
}: CreateBoardModalProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), description.trim(), selectedColor);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setName("");
    setDescription("");
    setSelectedColor("");
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
            sx={{ mt: 2 }}
          />

          <Divider sx={{ pt: 1 }} />

          {/* Board Color */}
          <Typography variant="subtitle2" sx={{ pt: 1 }}>
            Color (Optional)
          </Typography>

          <ColorPicker value={selectedColor} onChange={setSelectedColor} />
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
