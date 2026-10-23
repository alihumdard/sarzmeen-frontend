"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import VideoFormModal from "@/components/admin/VideoFormModal";
import SafeImage from "@/components/ui/SafeImage";
import { deleteVideo, listAdminVideos } from "@/lib/api/videos";
import type { Video } from "@/types/video";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  /* The value the list is actually filtered by, a beat behind the input. */
  const [appliedSearch, setAppliedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [deleting, setDeleting] = useState<Video | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVideos(await listAdminVideos({ status, search: appliedSearch }));
    } catch (err) {
      setError((err as Error).message || "Could not load videos.");
    } finally {
      setLoading(false);
    }
  }, [status, appliedSearch]);

  // Hold off on searching until the typing stops.
  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;

    /*
     * Loads inline rather than calling load(), so each state update is
     * guarded by `active` — switching filters quickly would otherwise let a
     * slower earlier response overwrite a newer one.
     */
    (async () => {
      try {
        const data = await listAdminVideos({ status, search: appliedSearch });
        if (active) {
          setVideos(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError((err as Error).message || "Could not load videos.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [status, appliedSearch]);

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteVideo(deleting.id);
      setDeleting(null);
      await load();
    } catch (err) {
      setError((err as Error).message || "Could not delete the video.");
      setDeleting(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Media / Videos"
        description="YouTube videos shown on the public Media page."
        action={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Add New Video
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title..."
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-[12px] outline-none focus:border-primary sm:max-w-xs"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 w-full rounded-md border border-gray-300 px-3 text-[12px] outline-none focus:border-primary sm:w-40"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <span className="text-[12px] text-gray-500 sm:ml-auto">
          {loading ? "Loading..." : `${videos.length} video${videos.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">
          {error}
        </p>
      )}

      {!loading && videos.length === 0 && !error ? (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
          <p className="text-[13px] font-semibold text-gray-700">
            No videos yet
          </p>
          <p className="mt-1 text-[12px] text-gray-500">
            Add a YouTube link and it will appear on the Media page.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="relative aspect-video bg-gray-100">
                <SafeImage
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                  fallbackText="—"
                />

                <div className="absolute left-2 top-2 flex gap-1.5">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      video.status === "published"
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {video.status}
                  </span>
                  {video.featured && (
                    <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <h2 className="line-clamp-2 text-[13px] font-bold leading-snug text-gray-900">
                  {video.title}
                </h2>

                <p className="mt-1 truncate text-[11px] text-gray-400">
                  /media/{video.slug}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
                  <span>
                    {video.views.toLocaleString()}{" "}
                    {video.views === 1 ? "view" : "views"}
                  </span>
                  <span>Order {video.sortOrder}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                  <a
                    href={`/media/${video.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11.5px] font-semibold text-gray-600 hover:text-primary"
                  >
                    View
                  </a>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(video);
                      setFormOpen(true);
                    }}
                    className="text-[11.5px] font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(video)}
                    className="ml-auto text-[11.5px] font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* `key` remounts the form so it picks up the row being edited. */}
      {formOpen && (
        <VideoFormModal
          key={editing?.id ?? "new"}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          video={editing}
          onSaved={load}
        />
      )}

      <AdminConfirmDialog
        open={Boolean(deleting)}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete this video?"
        message={`"${deleting?.title ?? ""}" will be removed from the Media page.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
