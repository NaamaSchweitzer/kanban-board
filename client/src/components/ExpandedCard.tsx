import { useState } from "react";
import {
  Drawer,
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip,
} from "@mui/material";
import { Close, DeleteOutline, Add } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import type { Card, Id, Tag } from "../types/kanban";
import ColorPicker from "./ColorPicker";

interface ExpandedCardProps {
  card: Card;
  open: boolean;
  onClose: () => void;
  onUpdateCard: (
    cardId: Id,
    data: {
      title?: string;
      description?: string;
      dueDate?: string | null;
      tags?: Tag[];
    },
  ) => void;
  onDeleteCard: () => void;
}

const ExpandedCard = ({
  card,
  open,
  onClose,
  onUpdateCard,
  onDeleteCard,
}: ExpandedCardProps) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>(
    card.dueDate ? new Date(card.dueDate) : null,
  );
  const [tags, setTags] = useState<Tag[]>(card.tags ?? []);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [newTagColor, setNewTagColor] = useState("");

  const handleAddTag = () => {
    const trimmed = newTagLabel.trim();
    if (!trimmed || !newTagColor) return;
    setTags((prev) => [...prev, { label: trimmed, color: newTagColor }]);
    setNewTagLabel("");
    setNewTagColor("");
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitle(card.title);
      return;
    }

    onUpdateCard(card._id, {
      title: trimmedTitle,
      description: description.trim(),
      dueDate: selectedDueDate?.toISOString() ?? null,
      tags,
    });
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "450px",
          padding: 2,
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">{card.title}</Typography>
          </Grid>
          <Grid container gap={2}>
            <Grid>
              <IconButton size="small" onClick={onDeleteCard}>
                <DeleteOutline />
              </IconButton>
            </Grid>
            <Grid>
              <IconButton onClick={onClose}>
                <Close fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Form */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            {/* Due Date */}
            <Grid size={{ xs: 12 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle1">Due date:</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={enGB}
                  >
                    <DatePicker
                      label="Due Date"
                      value={selectedDueDate}
                      onChange={(newValue) => setSelectedDueDate(newValue)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle1">Description:</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Tags */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Tags:
              </Typography>

              {/* Existing Tags */}
              {tags.length > 0 && (
                <Box
                  sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}
                >
                  {tags.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag.label}
                      size="small"
                      onDelete={() => handleRemoveTag(i)}
                      sx={{ bgcolor: tag.color, color: "black" }}
                    />
                  ))}
                </Box>
              )}

              {/* Add New Tag */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                  size="small"
                  label="Tag label"
                  value={newTagLabel}
                  onChange={(e) => setNewTagLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag();
                  }}
                />
                <ColorPicker value={newTagColor} onChange={setNewTagColor} />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddTag}
                  disabled={!newTagLabel.trim() || !newTagColor}
                >
                  Add tag
                </Button>
              </Box>
            </Grid>

            {/* Save Button */}
            <Grid size={{ xs: 12 }}>
              <Button fullWidth variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ExpandedCard;
