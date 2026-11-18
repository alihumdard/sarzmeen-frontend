"use client";

import { useCallback, useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import OwnerVideoCategories from "@/components/admin/OwnerVideoCategories";
import OwnerVideoFormModal from "@/components/admin/OwnerVideoFormModal";
import SafeImage from "@/components/ui/SafeImage";
import { useAuth } from "@/context/AuthContext";
import {
  deleteOwnerVideo,
  listOwnerVideoCategories,
  listOwnerVideos,
  type OwnerVideo,
  type OwnerVideoCategory,
  type VideoOwnerKind,
} from "@/lib/api/ownerVideos";

/**
 * An agent's or agency's own videos, as a section of their own.
 *
 * They used to live inside the profile page, which is not where anyone
 * looks for a feature with a list, a form and categories of its own.
 */
export default function MyVideosPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user.role !== "agent" && user.role !== "agency") {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-[13px] text-gray-500">
        This section belongs to agents and agencies.
      </div>
    );
  }

  return <MyVideos kind={user.role as VideoOwnerKind} />;
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
  draft: "bg-gray-100 text-gray-600",
  archived: "bg-gray-100 text-gray-600",
};

function MyVideos({ kind }: { kind: VideoOwnerKind }) {
  const [videos, setVideos] = useState<OwnerVideo[]>([]);
  const [categories, setCategories] = useState<OwnerVideoCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<OwnerVideo | null>(null);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [v, c] = await Promise.all([
        listOwnerVideos(kind),
        listOwnerVideoCategories(kind),
      ]);
      setVideos(v.data);
      setCategories(c.data);
    } catch (err) {
      setError((err as Error).message || "Could not load your videos.");
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (video: OwnerVideo) => {
    setRemoving(video.id);
    setError(null);

    try {
      await deleteOwnerVideo(kind, video.id);
      setVideos((current) => current.filter((v) => v.id !== video.id));
      setNotice("Removed.");
    } catch (err) {
      setError((err as Error).message || "Could not remove that video.");
    } finally {
      setRemoving(null);
    }
  };

  const shown =
    filter === "all"
      ? videos
      : filter === "none"
        ? videos.filter((v) => !v.categoryId)
        : videos.filter((v) => v.categoryId === filter);

  const waiting = videos.filter((v) => v.status === "pending").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="My Videos"
        breadcrumbs={[{ label: "My Videos" }]}
        action={
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            + Add Video
          </button>
        }
      />

      <p className="text-[12.5px] text-gray-500">
        YouTube videos shown on your public page. Each one is checked by an
        administrator before it goes up.
        {waiting > 0 && (
          <span className="ml-1 font-medium text-amber-700">
            {waiting === 1 ? "1 video is" : `${waiting} videos are`} waiting for
            review.
          </span>
        )}
      </p>

      <OwnerVideoCategories
        kind={kind}
        categories={categories}
        onChange={setCategories}
      />

      {(notice || error) && (
        <p
          className={`rounded-md px-3 py-2 text-[12px] ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "bg-emerald-50 font-medium text-emerald-700"
          }`}
        >
          {error ?? notice}
        </p>
      )}

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", name: "All" },
            ...categories.map((c) => ({ id: c.id, name: c.name })),
            { id: "none", name: "Uncategorised" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                filter === tab.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-[13px] font-medium text-gray-700">
            {videos.length === 0 ? "No videos yet" : "Nothing in this category"}
          </p>
          <p className="mt-1 text-[12px] text-gray-400">
            Paste a YouTube link and it appears here once approved.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((video) => (
            <article
              key={video.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
            >
              <div className="relative aspect-video w-full bg-gray-100">
                <SafeImage
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover"
                  unoptimized
                  fallbackText=""
                />
                <span
                  className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    STATUS_STYLES[video.status] ?? STATUS_STYLES.draft
                  }`}
                >
                  {video.statusLabel}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <h2 className="line-clamp-2 text-[13px] font-bold leading-snug text-gray-900">
                  {video.title}
                </h2>

                {video.category && (
                  <p className="mt-1 text-[11px] text-primary">
                    {video.category.name}
                  </p>
                )}

                {/* The reason it was turned down, where its owner will
                    see it: a rejection with no reason reads as a fault
                    in the site rather than something to fix. */}
                {video.status === "rejected" && video.reviewNote && (
                  <p className="mt-2 rounded-md border border-red-100 bg-red-50 px-2.5 py-2 text-[11.5px] leading-relaxed text-red-700">
                    {video.reviewNote}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditing(video)}
                    className="text-[11.5px] font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <span className="text-gray-200">|</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11.5px] font-semibold text-gray-600 hover:underline"
                  >
                    Watch
                  </a>
                  <button
                    type="button"
                    onClick={() => void remove(video)}
                    disabled={removing === video.id}
                    className="ml-auto text-[11.5px] font-semibold text-red-500 hover:underline disabled:opacity-40"
                  >
                    {removing === video.id ? "Removing…" : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {(adding || editing) && (
        <OwnerVideoFormModal
          kind={kind}
          video={editing}
          categories={categories}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSaved={(saved, wasNew) => {
            setVideos((current) =>
              wasNew
                ? [...current, saved]
                : current.map((v) => (v.id === saved.id ? saved : v)),
            );
            setAdding(false);
            setEditing(null);
            setNotice(
              saved.status === "pending"
                ? "Saved. An administrator will review it."
                : "Saved.",
            );
          }}
        />
      )}
    </div>
  );
}
