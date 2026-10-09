import { api } from "./client";

export type AgencyListItem = {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  agencyType: string | null;
  establishedYear: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  verified: boolean;
  totalAgents: number;
  locations: string[];
  services: string[];
  owner: {
    name: string;
    title: string;
    avatar: string | null;
    phone: string | null;
    email: string | null;
  };
};

export type AgencyDetail = AgencyListItem & {
  propertiesForSale: number;
  propertiesForRent: number;
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

export async function listAgencies(params: {
  city?: string;
  q?: string;
  page?: number;
  per_page?: number;
} = {}): Promise<PaginatedResponse<AgencyListItem>> {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "") qs.set(key, String(val));
  }
  const query = qs.toString();
  return api<PaginatedResponse<AgencyListItem>>(`/agencies${query ? `?${query}` : ""}`);
}

export async function getAgency(slug: string): Promise<AgencyDetail> {
  const res = await api<{ data: AgencyDetail }>(`/agencies/${slug}`);
  return res.data;
}
