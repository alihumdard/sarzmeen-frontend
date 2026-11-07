import type { Service, ServiceInput } from "@/types/service";
import { api } from "./client";
import { serverApi } from "./server";

/**
 * The published services, for the public page. Rendered on the server, so a
 * short revalidate keeps an edit from sitting behind the cache for long.
 */
export async function getPublicServices(): Promise<Service[]> {
  const res = await serverApi<{ data: Service[] }>("/services", 30);
  return res.data ?? [];
}

/** One published service for its own page, or null when there is none. */
export async function getPublicService(slug: string): Promise<Service | null> {
  try {
    const res = await serverApi<{ data: Service }>(
      `/services/${encodeURIComponent(slug)}`,
      30,
    );
    return res.data ?? null;
  } catch {
    // A missing or hidden service 404s; the page turns that into notFound().
    return null;
  }
}

export async function listServices(): Promise<Service[]> {
  const res = await api<{ data: Service[] }>("/admin/services");
  return res.data;
}

/* The client serialises the body itself, so pass the object through. */
export async function createService(input: ServiceInput): Promise<Service> {
  const res = await api<{ data: Service }>("/admin/services", {
    method: "POST",
    body: { ...input },
  });
  return res.data;
}

export async function updateService(
  id: string,
  input: ServiceInput,
): Promise<Service> {
  const res = await api<{ data: Service }>(`/admin/services/${id}`, {
    method: "PUT",
    body: { ...input },
  });
  return res.data;
}

export async function deleteService(id: string): Promise<void> {
  await api(`/admin/services/${id}`, { method: "DELETE" });
}
