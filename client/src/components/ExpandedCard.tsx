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
} from "@mui/material";
import { Close, DeleteOutline } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import type { Card, Id } from "../types/kanban";

interface ExpandedCardProps {
  card: Card;
  open: boolean;
  onClose: () => void;
  onUpdateCard: (
    cardId: Id,
    data: { title?: string; description?: string; dueDate?: string | null },
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
