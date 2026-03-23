import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  registerUser,
  login,
  updateUser,
  deleteUser,
  changePassword,
} from "../controllers/users.js";
import { verifyToken, verifyOwnership } from "../middleware/auth.js";

const router = Router();

// Public
router.post("/", registerUser);
router.post("/login", login);

// Protected
router.get("/", verifyToken, getAllUsers);
router.get("/:userId", verifyToken, getUserById);
router.put("/:userId", verifyToken, verifyOwnership, updateUser);
router.delete("/:userId", verifyToken, verifyOwnership, deleteUser);
router.post(
  "/:userId/change-password",
  verifyToken,
  verifyOwnership,
  changePassword,
);

export default router;
