import { api } from "./client";

/**
 * Reports, suggestions and change requests sent to the admin.
 *
 * Two sides of one thing: an agent or agency sends one in under `/my`, and
 * the admin works it through a status under `/admin`.
 */
export type ReportType = "problem" | "suggestion" | "change_request" | "other";

export type ReportStatus = "new" | "in_review" | "resolved" | "declined";

export type AdminReport = {
  id: string;
  type: ReportType;
  subject: string;
  body: string;
  attachment: string | null;
  status: ReportStatus;
  adminReply: string | null;
  repliedBy?: string | null;
  repliedAt: string | null;
  /** Only the admin list carries the sender. */
  sender?: {
    id: string;
    name: string;
    email: string;
    role: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

export type ReportPage = {
  data: AdminReport[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
};

export const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: "problem", label: "Report a problem" },
  { value: "change_request", label: "Request a change" },
  { value: "suggestion", label: "Suggestion" },
  { value: "other", label: "Something else" },
];

export const REPORT_STATUSES: { value: ReportStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In review" },
  { value: "resolved", label: "Resolved" },
  { value: "declined", label: "Declined" },
];

export function reportTypeLabel(type: string): string {
  return REPORT_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function reportStatusLabel(status: string): string {
  return REPORT_STATUSES.find((s) => s.value === status)?.label ?? status;
}

/* ---- the sender's own side ---- */

export async function listMyReports(page = 1): Promise<ReportPage> {
  return api(`/my/reports?page=${page}`);
}

export async function getMyReport(id: string): Promise<{ data: AdminReport }> {
  return api(`/my/reports/${id}`);
}

/**
 * Sent as FormData so an attachment can ride along; the API client passes
 * FormData through untouched and lets the browser set the boundary.
 */
export async function createMyReport(input: {
  type: ReportType;
  subject: string;
  body: string;
  attachment?: File | null;
}): Promise<{ data: AdminReport }> {
  const form = new FormData();
  form.append("type", input.type);
  form.append("subject", input.subject);
  form.append("body", input.body);
  if (input.attachment) form.append("attachment", input.attachment);

  return api("/my/reports", { method: "POST", body: form });
}

/* ---- the admin's side ---- */

export async function listAdminReports(params: {
  page?: number;
  status?: ReportStatus | "";
  type?: ReportType | "";
} = {}): Promise<ReportPage> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.status) q.set("status", params.status);
  if (params.type) q.set("type", params.type);

  const query = q.toString();
  return api(`/admin/reports${query ? `?${query}` : ""}`);
}

export async function adminReportStats(): Promise<{
  data: { new: number; inReview: number; resolved: number; declined: number };
}> {
  return api("/admin/reports/stats");
}

export async function updateAdminReport(
  id: string,
  body: { status: ReportStatus; adminReply?: string },
): Promise<{ data: AdminReport }> {
  return api(`/admin/reports/${id}`, { method: "PATCH", body });
}

export async function deleteAdminReport(id: string): Promise<void> {
  await api(`/admin/reports/${id}`, { method: "DELETE" });
}
