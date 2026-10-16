import { api } from "./client";

export type NotificationData = {
  type?: string;
  name?: string;
  email?: string;
  message?: string;
  property?: string | null;
  project?: string | null;
  title?: string;
  slug?: string;
  inquiry_id?: number | string;
  property_id?: number | string;
  [key: string]: unknown;
};

export type AppNotification = {
  id: string;
  type: string;
  data: NotificationData;
  read: boolean;
  readAt: string | null;
  createdAt: string;
};

export async function listNotifications(limit = 10): Promise<AppNotification[]> {
  const res = await api<{ data: AppNotification[] }>(
    `/my/notifications?per_page=${limit}`,
  );
  return res.data ?? [];
}

export async function getUnreadCount(): Promise<number> {
  const res = await api<{ data: { count: number } } | { count: number }>(
    "/my/notifications/unread-count",
  );
  // The endpoint has been seen wrapped and unwrapped; accept either.
  const body = res as { data?: { count?: number }; count?: number };
  return body.data?.count ?? body.count ?? 0;
}

export async function markAsRead(id: string): Promise<void> {
  await api(`/my/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllAsRead(): Promise<void> {
  await api("/my/notifications/mark-all-read", { method: "POST" });
}

/**
 * Turns a notification's payload into something readable.
 *
 * Each notification type stores different keys, so the title and detail are
 * derived here rather than stored, keeping the backend payload minimal.
 */
export function describeNotification(n: AppNotification): {
  title: string;
  detail: string;
} {
  const d = n.data ?? {};
  const listing = d.property || d.project;

  switch (d.type) {
    case "inquiry_received":
      return {
        title: "New inquiry received",
        detail: listing
          ? `${d.name ?? "Someone"} asked about ${listing}.`
          : `${d.name ?? "Someone"} sent an enquiry.`,
      };
    case "inquiry_status_changed":
      return {
        title: "Inquiry status updated",
        detail: listing ? `Enquiry about ${listing} was updated.` : "An enquiry was updated.",
      };
    case "property_status_changed":
      return {
        title: "Property status changed",
        detail: typeof d.title === "string" ? d.title : "One of your listings was updated.",
      };
    case "welcome":
      return { title: "Welcome to Sarzameen", detail: "Your account is ready." };
    default:
      return {
        title: typeof d.title === "string" ? d.title : "Notification",
        detail: typeof d.message === "string" ? d.message : "",
      };
  }
}

/** "5m ago", "2h ago", "3d ago" — compact enough for the dropdown. */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

/**
 * Where a notification should take the reader.
 *
 * Returns null when there is nowhere useful to go — the row then just marks
 * itself read rather than navigating somewhere arbitrary.
 */
export function notificationHref(n: AppNotification): string | null {
  const d = n.data ?? {};

  switch (d.type) {
    case "inquiry_received":
    case "inquiry_status_changed":
      return "/admin/inquiries";

    case "property_status_changed":
      // The listing itself is more useful than the moderation queue.
      return d.slug ? `/properties/${d.slug}` : "/admin/properties";

    case "property_approved":
    case "property_rejected":
      return d.slug ? `/properties/${d.slug}` : "/admin/properties";

    case "welcome":
      return "/admin/profile";

    default:
      return null;
  }
}
