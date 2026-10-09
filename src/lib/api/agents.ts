import { api } from "./client";

export type AgentListItem = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  avatar: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  yearsExperience: number | null;
  dealsClosed: number | null;
  officeAddress: string | null;
  verified: boolean;
  specializations: string[];
  languages: string[];
  agency: { id: string; name: string; slug: string } | null;
};

export type AgentDetail = AgentListItem & {
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

export async function listAgents(params: {
  city?: string;
  q?: string;
  page?: number;
  per_page?: number;
} = {}): Promise<PaginatedResponse<AgentListItem>> {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "") qs.set(key, String(val));
  }
  const query = qs.toString();
  return api<PaginatedResponse<AgentListItem>>(`/agents${query ? `?${query}` : ""}`);
}

export async function getAgent(slug: string): Promise<AgentDetail> {
  const res = await api<{ data: AgentDetail }>(`/agents/${slug}`);
  return res.data;
}
