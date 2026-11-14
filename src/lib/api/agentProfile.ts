import { api } from "./client";

/**
 * An agent's own profile — the bio and figures their public page shows.
 *
 * Separate from `/my/profile`, which is the signed-in person's account.
 * The name, phone and photograph live on that account and are saved
 * through here as well, so an agent fills in one form rather than two.
 */
export type AgentProfile = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  avatar: string;
  phone: string | null;
  email: string | null;
  bio: string | null;
  yearsExperience: number | null;
  dealsClosed: number | null;
  officeAddress: string | null;
  verified: boolean;
};

export async function getAgentProfile(): Promise<{ data: AgentProfile }> {
  return api("/agent/profile");
}

/**
 * Sent as FormData so the photograph can ride along; the API client passes
 * FormData through and lets the browser set the boundary.
 */
export async function updateAgentProfile(input: {
  name?: string;
  title?: string;
  bio?: string;
  yearsExperience?: string;
  dealsClosed?: string;
  officeAddress?: string;
  phone?: string;
  avatar?: File | null;
}): Promise<{ data: AgentProfile }> {
  const form = new FormData();

  for (const [key, value] of Object.entries(input)) {
    if (key === "avatar" || value === undefined || value === null) continue;
    form.append(key, String(value));
  }

  if (input.avatar) form.append("avatar", input.avatar);

  return api("/agent/profile", { method: "POST", body: form });
}
