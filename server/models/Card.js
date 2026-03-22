import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    dueDate: { type: String, default: null },

    // assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

// Fast fetch of cards in a column
cardSchema.index({ columnId: 1 });

// Fast “board snapshot” fetch
cardSchema.index({ boardId: 1 });

export const Card = mongoose.model("Card", cardSchema);
