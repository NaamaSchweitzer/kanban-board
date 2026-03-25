import type { Id, ReorderCardsPayload } from "../types/kanban";
import { BASE, jsonHeaders, parseError } from "./config";

export const createColumn = async (data: { title: string; boardId: Id }) => {
  const response = await fetch(`${BASE}/columns`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to create column");
  return response.json();
};

export const updateColumn = async (
  columnId: Id,
  data: { title: string },
) => {
  const response = await fetch(`${BASE}/columns/${columnId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to update column");
  return response.json();
};

export const deleteColumn = async (columnId: Id) => {
  const response = await fetch(`${BASE}/columns/${columnId}`, {
    method: "DELETE",
  });
  if (!response.ok) await parseError(response, "Failed to delete column");
  return response.json();
};

export const reorderCards = async ({
  columnId,
  cardIds,
}: ReorderCardsPayload) => {
  const response = await fetch(`${BASE}/columns/${columnId}/reorder-cards`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify({ cardIds }),
  });
  if (!response.ok) await parseError(response, "Failed to reorder cards");
  return response.json();
};
