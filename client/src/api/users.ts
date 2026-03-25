import type { User } from "../types/auth";
import { BASE, authHeaders, parseError } from "./config";

export const getUser = async (userId: string): Promise<User> => {
  const response = await fetch(`${BASE}/users/${userId}`, {
    headers: authHeaders(),
  });
  if (!response.ok) await parseError(response, "Failed to fetch user");
  return response.json();
};

export const updateUser = async (
  userId: string,
  data: { username?: string; email?: string },
): Promise<User> => {
  const response = await fetch(`${BASE}/users/${userId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to update user");
  return response.json();
};

export const deleteUser = async (userId: string): Promise<void> => {
  const response = await fetch(`${BASE}/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) await parseError(response, "Failed to delete user");
};

export const changePassword = async (
  userId: string,
  data: { oldPassword: string; newPassword: string },
): Promise<void> => {
  const response = await fetch(`${BASE}/users/${userId}/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to change password");
};
