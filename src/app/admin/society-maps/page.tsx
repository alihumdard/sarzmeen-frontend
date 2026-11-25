"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import SocietyMapFormModal from "@/components/admin/SocietyMapFormModal";
import SubmissionReviewPanel from "@/components/admin/SubmissionReviewPanel";
import SafeImage from "@/components/ui/SafeImage";
import {
  deleteSocietyMap,
  listAdminSocietyMaps,
  listSubmissions,
} from "@/lib/api/societyMaps";
import type { SocietyMap, SocietyMapSubmission } from "@/types/societyMap";

export default function AdminSocietyMapsPage() {
  const [maps, setMaps] = useState<SocietyMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  /* The value the list is filtered by, a beat behind the input, so a
     request does not go out on every keystroke. */
  const [query, setQuery] = useState("");

  /* Submissions live beside the maps they become, rather than on a page
     of their own: whoever publishes a map is the person reviewing what
     was sent in. */
  const [tab, setTab] = useState<"maps" | "submissions">("maps");
  const [submissions, setSubmissions] = useState<SocietyMapSubmission[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [subStatus, setSubStatus] = useState("pending");
  const [reloadKey, setReloadKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SocietyMap | null>(null);
  const [deleting, setDeleting] = useState<SocietyMap | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminSocietyMaps({
        status: status || undefined,
        search: query || undefined,
      });
      setMaps(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Could not load the maps.");
    } finally {
      setLoading(false);
    }
  }, [status, query]);

  useEffect(() => {
    let active = true;

    /*
     * Loads inline rather than calling load(), so each state update is
     * guarded by `active` — switching filters quickly would otherwise let
     * a slower earlier response overwrite a newer one.
     */
    (async () => {
      setLoading(true);
      try {
        const data = await listAdminSocietyMaps({
          status: status || undefined,
          search: query || undefined,
        });
        if (active) {
          setMaps(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError((err as Error).message || "Could not load the maps.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [status, query]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await listSubmissions({ status: subStatus || undefined });
        if (active) {
          setSubmissions(res.data);
          setPendingCount(res.pending);
        }
      } catch {
        /* The tab then shows none; the maps list still works. */
      }
    })();

    return () => {
      active = false;
    };
  }, [subStatus, reloadKey]);

  async function handleDelete() {
    if (!deleting) return;

    try {
      await deleteSocietyMap(deleting.id);
      setDeleting(null);
      await load();
    } catch (err) {
      setError((err as Error).message || "Could not delete that map.");
      setDeleting(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Society Maps"
        description="Map pages for housing societies, grouped by city on the public site."
        action={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Add Society Map
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-1 border-b border-gray-200">
        {([
          ["maps", "Published maps"],
          ["submissions", "Submissions"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`relative -mb-px border-b-2 px-4 py-2.5 text-[12.5px] font-semibold transition-colors ${
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
            {key === "submissions" && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10.5px] font-bold text-amber-700">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "submissions" ? (
        <div>
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
            <select
              value={subStatus}
              onChange={(e) => setSubStatus(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-[12px] outline-none focus:border-primary sm:w-44"
            >
              <option value="pending">In review</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
              <option value="">All</option>
            </select>

            <span className="text-[12px] text-gray-500 sm:ml-auto">
              {submissions.length}{" "}
              {submissions.length === 1 ? "submission" : "submissions"}
            </span>
          </div>

          {submissions.length === 0 ? (
            <p className="rounded-lg border border-gray-200 bg-white py-16 text-center text-[13px] text-gray-500">
              Nothing here. Maps sent in from the public page appear in this
              tab.
            </p>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <SubmissionReviewPanel
                  key={sub.id}
                  submission={sub}
                  onDone={() => {
                    setReloadKey((k) => k + 1);
                    void load();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
      <>
      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-[12px] outline-none focus:border-primary sm:max-w-xs"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-[12px] outline-none focus:border-primary sm:w-40"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <span className="text-[12px] text-gray-500 sm:ml-auto">
          {loading ? "Loading…" : `${maps.length} map${maps.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {error}
        </p>
      )}

      {!loading && maps.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white py-16 text-center text-[13px] text-gray-500">
          No maps yet. Add one to start the Society Maps page.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {maps.map((map) => (
            <article
              key={map.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="relative aspect-[4/3] bg-gray-50">
                <SafeImage
                  src={map.image}
                  alt={map.title}
                  fill
                  sizes="320px"
                  className="object-cover"
                  fallbackText="No image"
                />

                <span
                  className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    map.publishedAt
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {map.publishedAt ? "Published" : "Draft"}
                </span>

                {map.hasDocument && (
                  <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    PDF
                  </span>
                )}
              </div>

              <div className="p-3.5">
                <h3 className="line-clamp-2 text-[13px] font-bold text-gray-900">
                  {map.title}
                </h3>

                <p className="mt-1 text-[11.5px] text-gray-500">
                  {map.society?.name ?? "—"}
                  {map.city && ` · ${map.city.name}`}
                </p>

                <p className="mt-1.5 text-[11px] text-gray-400">
                  {map.views} views · {map.downloads} downloads
                </p>

                <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-2.5 text-[11.5px] font-semibold">
                  <a
                    href={`/society-maps/${map.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(map);
                      setFormOpen(true);
                    }}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(map)}
                    className="ml-auto text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      </>
      )}

      {/* Keyed so each map opens a fresh form rather than one still
          holding the last map's fields. */}
      <SocietyMapFormModal
        key={editing?.id ?? "new"}
        open={formOpen}
        map={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => void load()}
      />

      <AdminConfirmDialog
        open={deleting !== null}
        title="Delete this map?"
        message={`“${deleting?.title ?? ""}” and its image will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
