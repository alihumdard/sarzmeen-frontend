"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { ReportStatusBadge } from "@/components/reports/MyReports";
import {
  adminReportStats,
  deleteAdminReport,
  listAdminReports,
  reportTypeLabel,
  REPORT_STATUSES,
  REPORT_TYPES,
  updateAdminReport,
  type AdminReport,
  type ReportStatus,
  type ReportType,
} from "@/lib/api/reports";

type Stats = { new: number; inReview: number; resolved: number; declined: number };

/**
 * Reports, suggestions and change requests sent in by agents and agencies.
 *
 * The admin answers in place rather than by message, so the reply sits
 * beside what was asked and the sender sees both together.
 */
export default function AdminReportsPage() {
  const [items, setItems] = useState<AdminReport[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [status, setStatus] = useState<ReportStatus | "">("");
  const [type, setType] = useState<ReportType | "">("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* The report being answered, and the draft reply for it. */
  const [openId, setOpenId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [nextStatus, setNextStatus] = useState<ReportStatus>("in_review");
  const [busy, setBusy] = useState(false);

  /*
   * Re-runs whenever a filter changes. Written as a promise chain rather
   * than an awaited call so no state is set synchronously in the effect
   * body, and `active` drops a reply that arrives after the filter moved
   * on -- otherwise a slow first request could overwrite a faster second.
   *
   * A filter change deliberately leaves the current list on screen until
   * the new one lands, rather than blanking it to "Loading...".
   */
  useEffect(() => {
    let active = true;

    Promise.all([listAdminReports({ status, type }), adminReportStats()])
      .then(([list, counts]) => {
        if (!active) return;
        setError(null);
        setItems(list.data);
        setStats(counts.data);
      })
      .catch(() => {
        if (active) setError("Could not load reports.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status, type]);

  const beginReply = (r: AdminReport) => {
    setOpenId(r.id);
    setReply(r.adminReply ?? "");
    // Anything still new moves to in review by default; otherwise keep where it is.
    setNextStatus(r.status === "new" ? "in_review" : r.status);
  };

  const save = async (id: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await updateAdminReport(id, {
        status: nextStatus,
        ...(reply.trim() ? { adminReply: reply.trim() } : {}),
      });
      setItems((cur) => cur.map((r) => (r.id === id ? res.data : r)));
      setOpenId(null);
      setReply("");
      // The counts moved with the status.
      void adminReportStats()
        .then((s) => setStats(s.data))
        .catch(() => {});
    } catch (err) {
      setError((err as Error).message || "Could not save that.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (r: AdminReport) => {
    if (!confirm(`Delete "${r.subject}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteAdminReport(r.id);
      setItems((cur) => cur.filter((x) => x.id !== r.id));
    } catch {
      setError("Could not delete that report.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="Reports & Suggestions"
        description="Problems, change requests and suggestions sent in by agents and agencies."
      />

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="New" value={stats.new} tone="text-blue-600" />
          <StatCard label="In review" value={stats.inReview} tone="text-amber-600" />
          <StatCard label="Resolved" value={stats.resolved} tone="text-emerald-600" />
          <StatCard label="Declined" value={stats.declined} tone="text-red-600" />
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-white p-4">
        <label>
          <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
            Status
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReportStatus | "")}
            className="h-9 rounded-md border border-border px-3 text-[12.5px] text-text outline-none focus:border-primary"
          >
            <option value="">All statuses</option>
            {REPORT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
            Type
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ReportType | "")}
            className="h-9 rounded-md border border-border px-3 text-[12.5px] text-text outline-none focus:border-primary"
          >
            <option value="">All types</option>
            {REPORT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="rounded-xl border border-border bg-white py-16 text-center text-[12.5px] text-muted">
          Loading...
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-border bg-white py-16 text-center text-[12.5px] text-muted">
          No reports match this filter.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((r) => (
            <article
              key={r.id}
              className="rounded-xl border border-border bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-[13.5px] font-bold text-heading">
                    {r.subject}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {r.sender?.name ?? "Unknown"}
                    {r.sender?.role ? ` (${r.sender.role})` : ""}
                    {r.sender?.email ? ` · ${r.sender.email}` : ""}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {reportTypeLabel(r.type)} &middot; {sentOn(r.createdAt)}
                  </p>
                </div>
                <ReportStatusBadge status={r.status} />
              </div>

              <p className="mt-2.5 whitespace-pre-wrap text-[12px] leading-5 text-text">
                {r.body}
              </p>

              {r.attachment && (
                <a
                  href={r.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[11.5px] font-semibold text-primary underline"
                >
                  View attachment
                </a>
              )}

              {r.adminReply && openId !== r.id && (
                <div className="mt-3 rounded-md border-l-[3px] border-primary bg-surface px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Replied{r.repliedBy ? ` by ${r.repliedBy}` : ""}
                    {r.repliedAt ? ` · ${sentOn(r.repliedAt)}` : ""}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-[12px] leading-5 text-text">
                    {r.adminReply}
                  </p>
                </div>
              )}

              {openId === r.id ? (
                <div className="mt-3 flex flex-col gap-2.5 rounded-md border border-border bg-surface p-3">
                  <label>
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
                      Reply to the sender
                    </span>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={4}
                      maxLength={4000}
                      placeholder="What was done, or why it was not."
                      className="w-full resize-none rounded-md border border-border px-3 py-2 text-[12.5px] leading-5 text-text outline-none focus:border-primary"
                    />
                  </label>

                  <div className="flex flex-wrap items-end gap-2">
                    <label>
                      <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
                        Set status
                      </span>
                      <select
                        value={nextStatus}
                        onChange={(e) =>
                          setNextStatus(e.target.value as ReportStatus)
                        }
                        className="h-9 rounded-md border border-border bg-white px-3 text-[12.5px] text-text outline-none focus:border-primary"
                      >
                        {REPORT_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={() => void save(r.id)}
                      disabled={busy}
                      className="h-9 rounded-md bg-primary px-4 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      {busy ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenId(null)}
                      className="h-9 rounded-md border border-border bg-white px-3 text-[12px] font-semibold text-muted transition-colors hover:text-heading"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-[10.5px] text-muted">
                    The sender gets a notification when you reply, or when you
                    mark this resolved or declined.
                  </p>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-4 text-[12px] font-semibold">
                  <button
                    type="button"
                    onClick={() => beginReply(r)}
                    className="text-primary hover:underline"
                  >
                    {r.adminReply ? "Edit reply / status" : "Reply & set status"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(r)}
                    disabled={busy}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3">
      <p className="text-[10.5px] uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-0.5 text-[20px] font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function sentOn(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
