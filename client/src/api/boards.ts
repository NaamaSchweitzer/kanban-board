import type { Id, ReorderColumnsPayload } from "../types/kanban";
import { BASE, jsonHeaders } from "./config";

export const fetchBoard = async (boardId: string) => {
  const response = await fetch(`${BASE}/boards/${boardId}`);
  if (!response.ok) throw new Error("Board not found");
  return response.json();
};

export const listBoards = async (ownerId: string) => {
  const response = await fetch(`${BASE}/boards?ownerId=${ownerId}`);
  if (!response.ok) throw new Error("Failed to list boards");
  return response.json();
};

export const createBoard = async (data: {
  name: string;
  description?: string;
  ownerId: string;
}) => {
  const response = await fetch(`${BASE}/boards`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create board");
  return response.json();
};

export const updateBoard = async (
  boardId: Id,
  data: { name?: string; description?: string },
) => {
  const response = await fetch(`${BASE}/boards/${boardId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update board");
  return response.json();
};

export const deleteBoard = async (boardId: Id) => {
  const response = await fetch(`${BASE}/boards/${boardId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete board");
  return response.json();
};

export const reorderColumns = async ({
  boardId,
  columnIds,
}: ReorderColumnsPayload) => {
  const response = await fetch(`${BASE}/boards/${boardId}/reorder-columns`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify({ columnIds }),
  });
  if (!response.ok) throw new Error("Failed to reorder columns");
  return response.json();
};
