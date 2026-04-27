import type {
  CreateCardData,
  Id,
  MoveCardPayload,
  UpdateCardData,
} from "../types/kanban";
import { BASE, authHeaders, parseError } from "./config";

export const createCard = async (data: CreateCardData) => {
  const response = await fetch(`${BASE}/cards`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to create card");
  return response.json();
};

export const updateCard = async (cardId: Id, data: UpdateCardData) => {
  const response = await fetch(`${BASE}/cards/${cardId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseError(response, "Failed to update card");
  return response.json();
};

export const deleteCard = async (cardId: Id) => {
  const response = await fetch(`${BASE}/cards/${cardId}`, {
    method: "DELETE",
    headers: authHeaders(),
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
    headers: authHeaders(),
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
