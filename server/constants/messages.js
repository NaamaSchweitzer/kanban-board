export const commonMessages = {
  serverError: "Server error",
  invalidFields: (fields) => `Invalid fields: ${fields.join(", ")}`,
};

export const userMessages = {
  invalidId: "Invalid userId",
  notFound: "User not found",
  noFieldsToUpdate: "No user fields provided for update",
  registerRequiredFields: "username, email, and password are required",
  loginRequiredFields: "email and password are required",
  changePasswordRequiredFields: "oldPassword and newPassword are required",
  emailAlreadyExists: "Email already exists",
  usernameAlreadyExists: "Username already exists",
  duplicateField: "Email or username already exists",
  invalidCredentials: "Invalid email or password",
  wrongPassword: "Current password is incorrect",
};

export const boardMessages = {
  invalidId: "Invalid boardId",
  notFound: "Board not found",
  noFieldsToUpdate: "No board fields provided for update",
  createRequiredFields: "name and ownerId are required",
  ownerIdQueryRequired: "ownerId query param is required",
  invalidOwnerId: "Invalid ownerId",
  ownerNotFound: "Owner not found",
  columnIdsRequired: "columnIds array is required",
  memberRequired: "userId is required",
  memberAlreadyExists: "User is already a board member",
  memberNotFound: "User is not a board member",
  cannotRemoveOwner: "Cannot remove the board owner",
  assigneeNotMember: "Assignee must be a board member",
};

export const columnMessages = {
  invalidId: "Invalid columnId",
  notFound: "Column not found",
  noFieldsToUpdate: "No column fields provided for update",
  createRequiredFields: "title and boardId are required",
  boardIdQueryRequired: "boardId query param is required",
  cardIdsRequired: "cardIds array is required",
};

export const cardMessages = {
  invalidId: "Invalid cardId",
  notFound: "Card not found",
  noFieldsToUpdate: "No card fields provided for update",
  createRequiredFields: "boardId, columnId, and title are required",
  boardIdQueryRequired: "boardId query param is required",
  columnIdQueryRequired: "columnId query param is required",
  boardOrColumnQueryRequired: "boardId or columnId query param is required",
  moveRequiredFields: "sourceColumnId and destinationColumnId are required",
  boardOrColumnNotFound: "Board or column not found",
  targetColumnRequired: "destinationColumnId is required",
  invalidTargetColumn: "Target column not found in same board",
};
