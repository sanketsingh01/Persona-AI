import { apiFetch, API_URL } from "./api";
import type { ApiResponse, User } from "@/types/user";

export async function getMe(): Promise<User | null> {
  const res = await apiFetch("/api/v1/auth/getme");

  if (!res.ok) {
    return null;
  }

  const body = (await res.json()) as ApiResponse<{ user: User }>;
  return body.data.user;
}

export async function logout(): Promise<void> {
  await apiFetch("/api/v1/auth/logout");
}

export function getGoogleLoginUrl(): string {
  return `${API_URL}/api/v1/auth/google`;
}
