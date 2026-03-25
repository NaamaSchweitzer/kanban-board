export const BASE = "http://localhost:3000/api";

export const jsonHeaders = { "Content-Type": "application/json" };

export const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Handles 401 (expired/invalid token) by clearing session and redirecting
const handleUnauthorized = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Checks for 401, then extracts the server's error message and throws
export const parseError = async (response: Response, fallback: string) => {
  if (response.status === 401) handleUnauthorized();
  const body = await response.json().catch(() => ({}));
  throw new Error(typeof body === "string" ? body : (body.message ?? fallback));
};
