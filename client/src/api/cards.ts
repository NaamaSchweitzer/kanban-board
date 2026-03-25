import type { Id, MoveCardPayload } from "../types/kanban";
import { BASE, jsonHeaders, parseError } from "./config";

export const createCard = async (data: {
  boardId: Id;
  columnId: Id;
  title: string;
  description?: string;
}) => {
  const response = await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to create card");
  return response.json();
};

export const updateCard = async (
  cardId: Id,
  data: { title?: string; description?: string; dueDate?: string | null },
) => {
  const response = await fetch(`${BASE}/cards/${cardId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to update card");
  return response.json();
};

export const deleteCard = async (cardId: Id) => {
  const response = await fetch(`${BASE}/cards/${cardId}`, {
    method: "DELETE",
  });
  if (!response.ok) await parseError(response, "Failed to delete card");
  return response.json();
};

export const moveCard = async ({
  cardId,
  sourceColumnId,
  destinationColumnId,
  sourceCardIds,
  destinationCardIds,
}: MoveCardPayload) => {
  const response = await fetch(`${BASE}/cards/${cardId}/move`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify({
      sourceColumnId,
      destinationColumnId,
      sourceCardIds,
      destinationCardIds,
    }),
  });
  if (!response.ok) await parseError(response, "Failed to move card");
  return response.json();
};
