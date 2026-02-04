export const serverResponse = (res, status = 200, message = "") =>
  res.status(status).json(message).end();

/**

------------
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
  -------------
  const isDev = process.env.NODE_ENV !== "production";

catch (err) {
  console.error(err);

  return serverResponse(
    res,
    500,
    isDev ? err.message : "Internal server error"
  );
}

 */
