import { api } from "./client";

export type Location = {
  id: string;
  name: string;
  slug: string;
  type: string;
  parent: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  featured: boolean;
  createdAt: string;
};

export type LocationInput = {
  name: string;
  slug: string;
  type: string;
  parent?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
  featured?: boolean;
};

export async function listLocations(): Promise<Location[]> {
  const res = await api<{ data: Location[] }>("/locations");
  return res.data;
}

export async function createLocation(input: LocationInput): Promise<Location> {
  const res = await api<{ data: Location }>("/admin/locations", {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function updateLocation(id: string, input: LocationInput): Promise<Location> {
  const res = await api<{ data: Location }>(`/admin/locations/${id}`, {
    method: "PUT",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function deleteLocation(id: string): Promise<void> {
  await api(`/admin/locations/${id}`, { method: "DELETE" });
}
