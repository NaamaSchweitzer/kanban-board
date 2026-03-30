import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type { Board, Member } from "../types/kanban";
import type { User } from "../types/auth";
import { getAllUsers } from "../api/users";
import { stringAvatar } from "../utils/avatar";
import ConfirmationModal from "./ConfirmationModal";

interface ManageMembersPopoverProps {
  board: Board;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onAddMember: (userId: string) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
}

const ManageMembersPopover = ({
  board,
  anchorEl,
  onClose,
  onAddMember,
  onRemoveMember,
}: ManageMembersPopoverProps) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  // Fetch all users when popover opens
  useEffect(() => {
    if (!anchorEl) return;
    getAllUsers().then(setAllUsers).catch(console.error);
  }, [anchorEl]);

  const handleAddMember = () => {
    if (!selectedUserId) return;
    onAddMember(selectedUserId);
    setSelectedUserId("");
  };

  const handleRemoveMember = () => {
    if (memberToRemove) {
      onRemoveMember(memberToRemove._id);
      setMemberToRemove(null);
    }
  };

  // Users not already board members
  const availableUsers = allUsers.filter(
    (user) => !board.members?.some((m) => m._id === user._id),
  );

  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box sx={{ p: 2, width: 280 }}>
          {/* Add Member */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add member
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              select
              size="small"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              fullWidth
              disabled={availableUsers.length === 0}
              label={
                availableUsers.length === 0
                  ? "No users available"
                  : "Select user"
              }
            >
              {availableUsers.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.username}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              size="small"
              onClick={handleAddMember}
              disabled={!selectedUserId}
            >
              Add
            </Button>
          </Box>

          {/* Member List */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Members
          </Typography>
          {board.members?.map((member) => (
            <Box
              key={member._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Avatar
                {...stringAvatar(member.username, {
                  width: 28,
                  height: 28,
                  fontSize: 12,
                })}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                {member.username}
              </Typography>
              {member._id === String(board.ownerId) ? (
                <Typography variant="caption" color="text.secondary">
                  owner
                </Typography>
              ) : (
                <IconButton
                  size="small"
                  onClick={() => setMemberToRemove(member)}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Remove Member Confirmation */}
      <ConfirmationModal
        open={!!memberToRemove}
        title="Remove member"
        message={`Are you sure you want to remove "${memberToRemove?.username}" from this board?`}
        onConfirm={handleRemoveMember}
        onCancel={() => setMemberToRemove(null)}
      />
    </>
  );
};

export default ManageMembersPopover;
