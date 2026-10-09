import { api } from "./client";

export type AgentData = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  avatar: string | null;
  phone: string | null;
  email: string;
  bio: string | null;
  yearsExperience: number;
  dealsClosed: number;
  officeAddress: string | null;
  verified: boolean;
  specializations: string[];
  languages: string[];
};

type PaginatedResponse<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};

export function listAgents(page = 1) {
  return api<PaginatedResponse<AgentData>>(`/agency/agents?page=${page}`);
}

export function inviteAgent(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  title?: string;
  bio?: string;
  office_address?: string;
}) {
  return api<{ data: AgentData }>("/agency/agents", { method: "POST", body: data as Record<string, unknown> });
}

export function updateAgent(id: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  title?: string;
  bio?: string;
  office_address?: string;
}) {
  return api<{ data: AgentData }>(`/agency/agents/${id}`, { method: "PUT", body: data as Record<string, unknown> });
}

export function deleteAgent(id: string) {
  return api<void>(`/agency/agents/${id}`, { method: "DELETE" });
}
