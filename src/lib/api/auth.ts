import type { AuthUser } from "@/types/auth";
import { api, resetCsrf } from "./client";

export async function fetchUser(): Promise<AuthUser> {
  const res = await api<{ data: AuthUser }>("/me");
  return res.data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  await api("/login", {
    method: "POST",
    body: { email, password },
  });
  return fetchUser();
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  phone?: string;
  agencyName?: string;
}): Promise<AuthUser> {
  await api("/register", {
    method: "POST",
    body: data,
  });
  return fetchUser();
}

export async function logout(): Promise<void> {
  await api("/logout", { method: "POST" });
  resetCsrf();
}
