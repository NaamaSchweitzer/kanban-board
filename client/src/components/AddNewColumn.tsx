import { Add, CloseRounded } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface AddNewColumnProps {
  onCreateColumn: (title: string) => Promise<void>;
}

const AddNewColumn = ({ onCreateColumn }: AddNewColumnProps) => {
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleSubmit = () => {
    if (newColumnTitle.trim()) {
      onCreateColumn(newColumnTitle.trim());
      setNewColumnTitle("");
    }
  };

  // disable editing
  const handleClose = () => {
    setIsAddingColumn(false);
    setNewColumnTitle("");
  };

  // enable editing
  const handleOpen = () => {
    setIsAddingColumn(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return isAddingColumn ? (
    <Paper
      elevation={0}
      sx={{
        minWidth: 250,
        maxWidth: 250,
        borderRadius: 2,
        p: 1,
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? "#ececec"
            : theme.palette.background.paper,
      }}
    >
      <TextField
        placeholder="Enter column title..."
        variant="outlined"
        color="primary"
        value={newColumnTitle}
        onChange={(e) => setNewColumnTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        size="small"
        margin="dense"
        fullWidth
        autoFocus
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "white"
              : theme.palette.background.paper,
        }}
      />
      <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!newColumnTitle.trim()}
        >
          Add column
        </Button>
        <IconButton onClick={handleClose} size="small">
          <CloseRounded />
        </IconButton>
      </Box>
    </Paper>
  ) : (
    <Paper
      elevation={0}
      sx={{
        minWidth: 250,
        maxWidth: 250,
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? alpha("#ececec", 0.5)
            : alpha(theme.palette.background.paper, 0.5),
      }}
    >
      <Button
        startIcon={<Add />}
        sx={{
          color: "text.primary",
          justifyContent: "flex-start",
          px: 2,
          py: 1,
        }}
        fullWidth
        onClick={handleOpen}
      >
        Add new column
      </Button>
    </Paper>
  );
};

export default AddNewColumn;
