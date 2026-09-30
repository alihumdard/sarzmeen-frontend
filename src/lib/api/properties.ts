import type { Property, PropertyDetail } from "@/types/property";
import { api } from "./client";

type PropertyListParams = {
  purpose?: string;
  city?: string;
  type?: string;
  price_min?: string;
  price_max?: string;
  beds?: string;
  featured?: boolean;
  sort?: string;
  per_page?: number;
  page?: number;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export async function listProperties(
  params: PropertyListParams = {},
): Promise<PaginatedResponse<Property>> {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "" && val !== false) {
      qs.set(key, String(val));
    }
  }
  const query = qs.toString();
  return api<PaginatedResponse<Property>>(
    `/properties${query ? `?${query}` : ""}`,
  );
}

export async function getProperty(slug: string): Promise<PropertyDetail> {
  const res = await api<{ data: PropertyDetail }>(`/properties/${slug}`);
  return res.data;
}
