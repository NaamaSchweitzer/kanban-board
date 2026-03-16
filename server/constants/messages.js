export const commonMessages = {
  serverError: "Server error",
  invalidFields: (fields) => `Invalid fields: ${fields.join(", ")}`,
};

export const boardMessages = {
  ownerIdQueryRequired: "ownerId query param is required",
  invalidOwnerId: "Invalid ownerId",
  ownerNotFound: "Owner not found",
  invalidId: "Invalid boardId",
  notFound: "Board not found",
  createRequiredFields: "name and ownerId are required",
  noFieldsToUpdate: "No board fields provided for update",
};

export const columnMessages = {
  boardIdQueryRequired: "boardId query param is required",
  invalidBoardId: "Invalid boardId",
  invalidId: "Invalid columnId",
  notFound: "Column not found",
  createRequiredFields: "title and boardId are required",
  noFieldsToUpdate: "No column fields provided for update",
  beforeAndAfterCannotMatch: "beforeColumnId and afterColumnId cannot be the same",
  movedCannotBeNeighbor: "Moved column cannot also be a neighbor",
  invalidBeforeNeighbor: "beforeColumnId is invalid for this board",
  invalidAfterNeighbor: "afterColumnId is invalid for this board",
  invalidNeighborOrder: "Neighbor columns are not in a valid order",
};

export const cardMessages = {
  boardIdQueryRequired: "boardId query param is required",
  columnIdQueryRequired: "columnId query param is required",
  boardOrColumnQueryRequired: "query param boardId/columnId is required",
  invalidBoardId: "Invalid boardId",
  invalidColumnId: "Invalid columnId",
  invalidId: "Invalid cardId",
  notFound: "Card not found",
  createRequiredFields: "boardId, columnId, title are required",
  boardOrColumnNotFound: "Board or column not found",
  noFieldsToUpdate: "No card fields provided for update",
  targetColumnRequired: "toColumnId is required",
  beforeAndAfterCannotMatch: "beforeCardId and afterCardId cannot be the same",
  movedCannotBeNeighbor: "Moved card cannot also be a neighbor",
  invalidTargetColumn: "Target column not found in same board",
  invalidBeforeNeighbor: "beforeCardId is invalid for target column",
  invalidAfterNeighbor: "afterCardId is invalid for target column",
  invalidNeighborOrder: "Neighbor cards are not in a valid order",
};
