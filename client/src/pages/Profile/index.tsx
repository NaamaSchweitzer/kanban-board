import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmationModal from "../../components/ConfirmationModal";

const Profile = () => {
  const { user, updateUser, deleteUser, changePassword } = useAuth();
  const navigate = useNavigate();

  // Edit profile state
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Change password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Delete account state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");

    try {
      const updates: { username?: string; email?: string } = {};
      if (username.trim() !== user?.username)
        updates.username = username.trim();
      if (email.trim() !== user?.email) updates.email = email.trim();

      if (Object.keys(updates).length === 0) {
        setProfileError("No changes to save");
        return;
      }

      await updateUser(updates);
      setProfileMessage("Profile updated successfully");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    try {
      await changePassword(oldPassword, newPassword);
      setPasswordMessage("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Password change failed",
      );
    }
  };

  const handleDeleteAccount = async () => {
    await deleteUser();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Profile
        </Typography>

        {/* Edit Profile */}
        <Box component="form" onSubmit={handleUpdateProfile} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Account details
          </Typography>

          {profileMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {profileMessage}
            </Alert>
          )}
          {profileError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {profileError}
            </Alert>
          )}

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Save changes
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Change Password */}
        <Box component="form" onSubmit={handleChangePassword} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Change password
          </Typography>

          {passwordMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {passwordMessage}
            </Alert>
          )}
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}

          <TextField
            label="Current password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Change password
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Delete Account */}
        <Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Danger zone
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDeleteModal(true)}
          >
            Delete account
          </Button>
        </Box>

        {/* Delete Account Confirmation Modal */}
        <ConfirmationModal
          open={openDeleteModal}
          title="Delete account"
          message="Are you sure you want to delete your account? This action cannot be undone. All your boards and data will be permanently deleted."
          confirmLabel="Delete my account"
          onConfirm={handleDeleteAccount}
          onCancel={() => setOpenDeleteModal(false)}
        />
      </Box>
    </Container>
  );
};

export default Profile;
