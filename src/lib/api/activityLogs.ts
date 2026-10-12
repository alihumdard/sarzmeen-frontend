import { api } from "./client";

export type ActivityChange = {
  field: string;
  from: string | null;
  to: string | null;
};

export type ActivityEntry = {
  id: string;
  log: string;
  logLabel: string;
  event: string | null;
  eventLabel: string;
  causer: string;
  causerId: number | null;
  subjectType: string | null;
  subjectId: number | null;
  subjectTitle: string | null;
  changes: ActivityChange[];
  properties: Record<string, unknown> | null;
  createdAt: string | null;
  date: string | null;
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ActivityFilters = {
  logs: string[];
  events: string[];
};

export async function listActivity(
  params?: string,
): Promise<{ data: ActivityEntry[]; meta: Meta }> {
  return api<{ data: ActivityEntry[]; meta: Meta }>(
    `/admin/activity-logs${params ? `?${params}` : ""}`,
  );
}

export async function getActivityFilters(): Promise<ActivityFilters> {
  const res = await api<{ data: ActivityFilters }>("/admin/activity-logs/filters");
  return res.data;
}
