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

    cardIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
      default: [],
    },
  },
  { timestamps: true },
);


export const Column = mongoose.model("Column", columnSchema);
