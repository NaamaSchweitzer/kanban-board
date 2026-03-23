import type { AuthResponse } from "../types/auth";
import { BASE, jsonHeaders } from "./config";

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const message = await response.json();
    throw new Error(typeof message === "string" ? message : "Registration failed");
  }
  return response.json();
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const message = await response.json();
    throw new Error(typeof message === "string" ? message : "Login failed");
  }
  return response.json();
};
