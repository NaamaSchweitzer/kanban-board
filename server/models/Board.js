import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    color: { type: String, default: null },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    columnIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }],
      default: [],
    },
    memberIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true },
);

export const Board = mongoose.model("Board", boardSchema);
