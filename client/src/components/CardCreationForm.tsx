import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import { useState } from "react";

export interface CardFormData {
  title: string;
  description: string;
  dueDate: string | null;
}

interface CardCreationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CardFormData) => void;
}

const CardCreationForm = ({ open, onClose, onSubmit }: CardCreationFormProps) => {
  const initialCardData = {
    title: "",
    description: "",
  };

  const [cardData, setCardData] = useState(initialCardData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handleDateChange = (newValue: Date | null) => {
    setSelectedDate(newValue);
  };

  const handleClose = () => {
    onClose();
    setCardData(initialCardData);
    setSelectedDate(null);
  };

  const handleSubmit = () => {
    if (cardData.title.trim()) {
      onSubmit({
        title: cardData.title.trim(),
        description: cardData.description.trim(),
        dueDate: selectedDate?.toISOString() || null,
      });
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add new card</DialogTitle>
      <DialogContent>
        {/* Title */}
        <TextField
          label="Title"
          name="title"
          value={cardData.title}
          onChange={handleChange}
          fullWidth
          required
          autoFocus
          margin="normal"
        />

        {/* Description */}
        <TextField
          label="Description"
          name="description"
          value={cardData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        {/* Due Date */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
          <DatePicker
            label="Due Date"
            value={selectedDate}
            onChange={handleDateChange}
            disablePast
            slotProps={{
              textField: {
                margin: "normal",
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!cardData.title.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardCreationForm;
