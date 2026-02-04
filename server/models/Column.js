import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },

    // Drag & drop ordering (use gaps: 1000, 2000, 3000...)
    position: { type: Number, required: true, default: 1000 },
  },
  { timestamps: true },
);

// Fast sorted fetch of columns for a board
columnSchema.index({ boardId: 1, position: 1 });

export const Column = mongoose.model("Column", columnSchema);
