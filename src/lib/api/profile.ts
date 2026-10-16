import { api } from "./client";
import type { AuthUser } from "@/types/auth";

export type ProfileInput = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  avatarFile?: File | null;
};

export async function updateProfile(input: ProfileInput): Promise<AuthUser> {
  // An avatar needs multipart, so POST with _method spoofing; otherwise JSON.
  if (input.avatarFile) {
    const fd = new FormData();
    fd.append("_method", "PUT");
    fd.append("name", input.name);
    fd.append("email", input.email);
    if (input.phone) fd.append("phone", input.phone);
    if (input.city) fd.append("city", input.city);
    fd.append("avatarFile", input.avatarFile);

    const res = await api<{ data: AuthUser }>("/my/profile", {
      method: "POST",
      body: fd,
    });
    return res.data;
  }

  const res = await api<{ data: AuthUser }>("/my/profile", {
    method: "PUT",
    body: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      city: input.city ?? "",
    } as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function updatePassword(input: {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}): Promise<void> {
  await api("/my/profile/password", {
    method: "PUT",
    body: {
      currentPassword: input.currentPassword,
      password: input.password,
      // Laravel's `confirmed` rule looks for this exact snake_case key.
      password_confirmation: input.passwordConfirmation,
    } as unknown as Record<string, unknown>,
  });
}
