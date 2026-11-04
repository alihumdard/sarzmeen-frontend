import { api } from "./client";

/**
 * An agency's own profile, including the logo shown on its public page.
 *
 * Separate from `/my/profile`, which is the signed-in person's own account:
 * the agency is a record of its own, and its logo is not an avatar.
 */
export type AgencyProfile = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  city: string | null;
  address: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website?: string;
  establishedYear: number | null;
  verified: boolean;
  totalAgents?: number;
};

export async function getAgencyProfile(): Promise<{ data: AgencyProfile }> {
  return api("/agency/profile");
}

/**
 * Sent as FormData so the logo can ride along; the API client passes
 * FormData through and lets the browser set the boundary.
 */
export async function updateAgencyProfile(input: {
  name?: string;
  city?: string;
  address?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  establishedYear?: string;
  logo?: File | null;
}): Promise<{ data: AgencyProfile }> {
  const form = new FormData();

  for (const [key, value] of Object.entries(input)) {
    if (key === "logo" || value === undefined || value === null) continue;
    form.append(key, String(value));
  }

  if (input.logo) form.append("logo", input.logo);

  return api("/agency/profile", { method: "POST", body: form });
}
