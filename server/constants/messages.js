export const commonMessages = {
  serverError: "Server error",
  invalidFields: (fields) => `Invalid fields: ${fields.join(", ")}`,
};

export const userMessages = {
  invalidId: "Invalid userId",
  notFound: "User not found",
  registerRequiredFields: "username, email and password are required",
  loginRequiredFields: "email and password are required",
  changePasswordRequiredFields: "oldPassword and newPassword are required",
  emailAlreadyExists: "Email already exists",
  usernameAlreadyExists: "Username already exists",
  duplicateField: "Email or username already exists",
  invalidCredentials: "Invalid email or password",
  wrongPassword: "Current password is incorrect",
  noFieldsToUpdate: "No user fields provided for update",
};

export const boardMessages = {
  ownerIdQueryRequired: "ownerId query param is required",
  invalidOwnerId: "Invalid ownerId",
  ownerNotFound: "Owner not found",
  invalidId: "Invalid boardId",
  notFound: "Board not found",
  createRequiredFields: "name and ownerId are required",
  noFieldsToUpdate: "No board fields provided for update",
  columnIdsRequired: "columnIds array is required",
};

export const columnMessages = {
  boardIdQueryRequired: "boardId query param is required",
  invalidId: "Invalid columnId",
  notFound: "Column not found",
  createRequiredFields: "title and boardId are required",
  noFieldsToUpdate: "No column fields provided for update",
  cardIdsRequired: "cardIds array is required",
};

export const cardMessages = {
  boardIdQueryRequired: "boardId query param is required",
  columnIdQueryRequired: "columnId query param is required",
  boardOrColumnQueryRequired: "query param boardId/columnId is required",
  invalidId: "Invalid cardId",
  notFound: "Card not found",
  createRequiredFields: "boardId, columnId, title are required",
  moveRequiredFields: "sourceColumnId and destinationColumnId are required",
  boardOrColumnNotFound: "Board or column not found",
  noFieldsToUpdate: "No card fields provided for update",
  targetColumnRequired: "destinationColumnId is required",
  invalidTargetColumn: "Target column not found in same board",
};
