"use client";

import { useEffect, useRef, useState } from "react";
import {
  createMyReport,
  listMyReports,
  reportStatusLabel,
  reportTypeLabel,
  REPORT_TYPES,
  type AdminReport,
  type ReportType,
} from "@/lib/api/reports";

/**
 * An agent's or agency's own reports: the form to send one, and the list of
 * what they have sent with whatever the admin answered.
 *
 * Separate from messaging on purpose — a report carries a status the admin
 * works through, so it can be chased until it is resolved.
 */
export default function MyReports() {
  const [items, setItems] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<ReportType>("problem");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  /*
   * A promise chain rather than an awaited call, so no state is set
   * synchronously in the effect body; `active` drops the result if this
   * unmounts while the request is still out.
   */
  useEffect(() => {
    let active = true;

    listMyReports()
      .then((res) => {
        if (active) setItems(res.data);
      })
      .catch(() => {
        if (active) setError("Could not load your reports.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const submit = async () => {
    if (!subject.trim() || !body.trim() || sending) return;

    setSending(true);
    setError(null);
    setNotice(null);
    try {
      const res = await createMyReport({
        type,
        subject: subject.trim(),
        body: body.trim(),
        attachment: file,
      });
      // Straight onto the top of the list, where the API would also put it.
      setItems((cur) => [res.data, ...cur]);
      setSubject("");
      setBody("");
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      setNotice("Sent. The admin will see this and reply here.");
    } catch (err) {
      setError((err as Error).message || "Could not send that report.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      {/* The form */}
      <section className="rounded-xl border border-border bg-white p-4">
        <h2 className="text-[14px] font-bold text-heading">
          Send a report to the admin
        </h2>
        <p className="mt-1 text-[12px] leading-5 text-muted">
          Report a problem, ask for something to be changed, or suggest an
          improvement. You will see the reply below.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <label>
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
              Type
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ReportType)}
              className="h-10 w-full rounded-md border border-border px-3 text-[12.5px] text-text outline-none focus:border-primary"
            >
              {REPORT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
              Subject
            </span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={160}
              placeholder="e.g. Please correct my agency phone number"
              className="h-10 w-full rounded-md border border-border px-3 text-[12.5px] text-text outline-none focus:border-primary"
            />
          </label>

          <label>
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
              Details
            </span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              maxLength={4000}
              placeholder="Explain what needs changing, and what it should say instead."
              className="w-full resize-none rounded-md border border-border px-3 py-2 text-[12.5px] leading-5 text-text outline-none focus:border-primary"
            />
          </label>

          <div>
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
              Attachment (optional)
            </span>
            <input
              ref={fileInput}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-[11.5px] text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-surface file:px-3 file:py-1.5 file:text-[11.5px] file:font-semibold file:text-heading"
            />
            <p className="mt-1 text-[10.5px] text-muted">
              JPG, PNG, WEBP or PDF, up to 5 MB.
            </p>
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11.5px] text-red-700">
              {error}
            </p>
          )}

          {notice && (
            <p className="rounded-md bg-primary-light px-3 py-2 text-[11.5px] font-medium text-primary">
              {notice}
            </p>
          )}

          <button
            type="button"
            onClick={() => void submit()}
            disabled={sending || !subject.trim() || !body.trim()}
            className="h-10 rounded-md bg-primary text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {sending ? "Sending..." : "Send report"}
          </button>
        </div>
      </section>

      {/* What was sent, and what came back */}
      <section>
        <h2 className="mb-3 text-[14px] font-bold text-heading">
          Your reports
        </h2>

        {loading ? (
          <p className="rounded-xl border border-border bg-white py-14 text-center text-[12.5px] text-muted">
            Loading...
          </p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-border bg-white py-14 text-center text-[12.5px] text-muted">
            You have not sent a report yet.
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
                    <h3 className="text-[13px] font-bold text-heading">
                      {r.subject}
                    </h3>
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

                {r.adminReply && (
                  <div className="mt-3 rounded-md border-l-[3px] border-primary bg-surface px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Admin reply
                      {r.repliedBy ? ` — ${r.repliedBy}` : ""}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-[12px] leading-5 text-text">
                      {r.adminReply}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function ReportStatusBadge({ status }: { status: string }) {
  const tone =
    status === "resolved"
      ? "bg-emerald-50 text-emerald-700"
      : status === "in_review"
        ? "bg-amber-50 text-amber-700"
        : status === "declined"
          ? "bg-red-50 text-red-700"
          : "bg-blue-50 text-blue-700";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${tone}`}
    >
      {reportStatusLabel(status)}
    </span>
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
