import { Box } from "@mui/material";

const PRESET_COLORS = [
  "#DBEAFE", // blue
  "#EDE9FE", // purple
  "#DCFCE7", // green
  "#FEF9C3", // yellow
  "#FFEDD5", // orange
  "#FEE2E2", // red
  "#FCE7F3", // pink
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {PRESET_COLORS.map((color) => (
        <Box
          key={color}
          onClick={() => onChange(value !== color ? color : "")}
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: color,
            cursor: "pointer",
            border:
              value === color ? "2px solid black" : "2px solid transparent",
            "&:hover": { opacity: 0.8 },
          }}
        />
      ))}
    </Box>
  );
};

export default ColorPicker;
