import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"], // regex validator
    },
    password: { type: String, required: true},
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
