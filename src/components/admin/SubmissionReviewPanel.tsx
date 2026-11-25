"use client";

import { useEffect, useMemo, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { listLocations, type Location } from "@/lib/api/locations";
import { approveSubmission, rejectSubmission } from "@/lib/api/societyMaps";
import type { SocietyMapSubmission } from "@/types/societyMap";

const input =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-[12.5px] outline-none focus:border-primary";

/**
 * One submitted map, with everything needed to judge it.
 *
 * Publishing asks for the two things the sender could not give: which
 * location this really is, and the title the page will carry.
 */
export default function SubmissionReviewPanel({
  submission,
  onDone,
}: {
  submission: SocietyMapSubmission;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"idle" | "approve" | "reject">("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(`${submission.societyName} Map`);
  const [summary, setSummary] = useState(submission.notes);
  const [note, setNote] = useState("");

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [query, setQuery] = useState(submission.societyName);

  useEffect(() => {
    if (mode !== "approve") return;

    listLocations()
      .then(setLocations)
      .catch(() => {
        /* The picker is then empty; the error below says so on save. */
      });
  }, [mode]);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];

    return locations
      .filter(
        (l) =>
          (l.type === "society" || l.type === "area") &&
          l.name.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [locations, query]);

  const chosen = locations.find((l) => Number(l.id) === locationId) ?? null;

  const fail = (err: unknown, fallback: string) => {
    const e = err as Error & { errors?: Record<string, string[]> };
    setError(Object.values(e.errors ?? {}).flat()[0] || e.message || fallback);
  };

  const approve = async () => {
    if (busy) return;

    if (!locationId) {
      setError("Pick the society this map belongs to.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await approveSubmission(submission.id, {
        locationId,
        title: title.trim(),
        summary: summary.trim() || undefined,
      });
      onDone();
    } catch (err) {
      fail(err, "Could not publish that map.");
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    if (busy) return;

    if (!note.trim()) {
      setError("Say why, so the sender knows what to fix.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await rejectSubmission(submission.id, note.trim());
      onDone();
    } catch (err) {
      fail(err, "Could not reject that submission.");
    } finally {
      setBusy(false);
    }
  };

  const pending = submission.status === "pending";

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <a
          href={submission.image}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block h-36 w-full shrink-0 overflow-hidden rounded-md bg-gray-50 sm:w-52"
          title="Open the full-size image"
        >
          <SafeImage
            src={submission.image}
            alt={submission.societyName}
            fill
            sizes="208px"
            className="object-cover"
            fallbackText="No image"
          />
        </a>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-bold text-gray-900">
              {submission.societyName}
            </h3>
            <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-[10.5px] text-gray-500">
              {submission.reference}
            </span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                submission.status === "pending"
                  ? "bg-amber-50 text-amber-700"
                  : submission.status === "published"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
              }`}
            >
              {submission.statusLabel}
            </span>
          </div>

          <dl className="mt-2.5 grid gap-x-6 gap-y-1.5 text-[12px] sm:grid-cols-2">
            {submission.cityName && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-gray-400">City</dt>
                <dd className="truncate text-gray-800">
                  {submission.cityName}
                </dd>
              </div>
            )}

            <div className="flex gap-2">
              <dt className="shrink-0 text-gray-400">NOC</dt>
              <dd className="truncate text-gray-800">
                {submission.nocApproved === null
                  ? "Not stated"
                  : submission.nocApproved
                    ? `Approved${submission.nocAuthority ? ` — ${submission.nocAuthority}` : ""}`
                    : "Not yet approved"}
                {/* Their claim, not a check the site has made. */}
                <span className="ml-1 text-gray-400">(as stated)</span>
              </dd>
            </div>

            <div className="flex gap-2">
              <dt className="shrink-0 text-gray-400">From</dt>
              <dd className="flex min-w-0 items-center gap-1.5 text-gray-800">
                {submission.contact.photo && (
                  <a
                    href={submission.contact.photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-gray-100"
                    title="Open the photo"
                  >
                    <SafeImage
                      src={submission.contact.photo}
                      alt={submission.contact.name}
                      fill
                      sizes="20px"
                      className="object-cover"
                      fallbackText=""
                    />
                  </a>
                )}
                <span className="truncate">
                  {submission.contact.name}
                  {submission.contact.role && ` · ${submission.contact.role}`}
                </span>
              </dd>
            </div>

            <div className="flex gap-2">
              <dt className="shrink-0 text-gray-400">Phone</dt>
              <dd className="truncate">
                <a
                  href={`https://wa.me/${submission.contact.phone.replace(/\D/g, "").replace(/^0/, "92")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  {submission.contact.phone}
                </a>
              </dd>
            </div>

            {submission.contact.email && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-gray-400">Email</dt>
                <dd className="truncate text-gray-800">
                  {submission.contact.email}
                </dd>
              </div>
            )}

            {submission.document && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-gray-400">Document</dt>
                <dd>
                  <a
                    href={submission.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    Open PDF
                  </a>
                </dd>
              </div>
            )}
          </dl>

          {submission.notes && (
            <p className="mt-2.5 line-clamp-3 text-[12px] leading-5 text-gray-600">
              {submission.notes}
            </p>
          )}

          {submission.reviewNote && (
            <p className="mt-2.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11.5px] text-red-700">
              {submission.reviewNote}
            </p>
          )}

          {submission.mapSlug && (
            <a
              href={`/society-maps/${submission.mapSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-block text-[11.5px] font-semibold text-primary hover:underline"
            >
              View the published map
            </a>
          )}

          {pending && mode === "idle" && (
            <div className="mt-3.5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMode("approve")}
                className="h-9 rounded-md bg-primary px-4 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => setMode("reject")}
                className="h-9 rounded-md border border-red-300 px-4 text-[12px] font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mx-4 mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {error}
        </p>
      )}

      {mode === "approve" && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
          <p className="mb-3 text-[12px] text-gray-500">
            Publishing needs the two things the sender could not give.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[11.5px] font-semibold text-gray-700">
                Title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                className={input}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[11.5px] font-semibold text-gray-700">
                Society {chosen && <span className="text-primary">· {chosen.name}</span>}
              </span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLocationId(null);
                  setError(null);
                }}
                placeholder="Search a society…"
                className={input}
              />

              {matches.length > 0 && !locationId && (
                <ul className="mt-1 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-sm">
                  {matches.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setLocationId(Number(l.id));
                          setQuery(l.name);
                        }}
                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[12px] hover:bg-gray-50"
                      >
                        <span className="truncate text-gray-800">{l.name}</span>
                        <span className="shrink-0 text-[10.5px] uppercase text-gray-400">
                          {l.type}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </label>
          </div>

          <label className="mt-3 block">
            <span className="mb-1 block text-[11.5px] font-semibold text-gray-700">
              Summary
            </span>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={500}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-[12.5px] outline-none focus:border-primary"
            />
          </label>

          <div className="mt-3 flex items-center gap-2.5">
            <button
              type="button"
              onClick={approve}
              disabled={busy || !title.trim()}
              className="h-9 rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {busy ? "Publishing…" : "Publish map"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("idle");
                setError(null);
              }}
              className="h-9 px-2 text-[12px] font-semibold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {mode === "reject" && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
          <label className="block">
            <span className="mb-1 block text-[11.5px] font-semibold text-gray-700">
              Why is this being turned down?
            </span>
            <textarea
              autoFocus
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setError(null);
              }}
              maxLength={500}
              rows={2}
              placeholder="e.g. The image is too small to read plot numbers."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-[12.5px] outline-none focus:border-primary"
            />
          </label>

          <div className="mt-3 flex items-center gap-2.5">
            <button
              type="button"
              onClick={reject}
              disabled={busy}
              className="h-9 rounded-md bg-red-600 px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {busy ? "Saving…" : "Reject"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("idle");
                setError(null);
              }}
              className="h-9 px-2 text-[12px] font-semibold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
