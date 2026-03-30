import type {
  CreateBoardData,
  Id,
  ReorderColumnsPayload,
  UpdateBoardData,
} from "../types/kanban";
import { BASE, jsonHeaders, parseError } from "./config";

export const fetchBoard = async (boardId: string) => {
  const response = await fetch(`${BASE}/boards/${boardId}`);
  if (!response.ok) await parseError(response, "Board not found");
  return response.json();
};

export const listBoards = async (ownerId: string) => {
  const response = await fetch(`${BASE}/boards?ownerId=${ownerId}`);
  if (!response.ok) await parseError(response, "Failed to list boards");
  return response.json();
};

export const listMemberBoards = async (userId: string) => {
  const response = await fetch(`${BASE}/boards?userId=${userId}`);
  if (!response.ok) await parseError(response, "Failed to list member boards");
  return response.json();
};

export const createBoard = async (data: CreateBoardData) => {
  const response = await fetch(`${BASE}/boards`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to create board");
  return response.json();
};

export const updateBoard = async (boardId: Id, data: UpdateBoardData) => {
  const response = await fetch(`${BASE}/boards/${boardId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to update board");
  return response.json();
};

export const deleteBoard = async (boardId: Id) => {
  const response = await fetch(`${BASE}/boards/${boardId}`, {
    method: "DELETE",
  });
  if (!response.ok) await parseError(response, "Failed to delete board");
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
  if (!response.ok) await parseError(response, "Failed to reorder columns");
  return response.json();
};

export const addMember = async (boardId: Id, userId: string) => {
  const response = await fetch(`${BASE}/boards/${boardId}/members`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) await parseError(response, "Failed to add member");
  return response.json();
};

export const removeMember = async (boardId: Id, userId: string) => {
  const response = await fetch(`${BASE}/boards/${boardId}/members/${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) await parseError(response, "Failed to remove member");
  return response.json();
};
