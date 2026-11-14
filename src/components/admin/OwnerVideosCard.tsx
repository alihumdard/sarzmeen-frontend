"use client";

import { useEffect, useState } from "react";
import AdminFormField, {
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import SafeImage from "@/components/ui/SafeImage";
import {
  createOwnerVideo,
  deleteOwnerVideo,
  listOwnerVideos,
  type OwnerVideo,
  type VideoOwnerKind,
} from "@/lib/api/ownerVideos";

/**
 * The videos shown on an agent's or agency's public page.
 *
 * Deliberately not the site's video library: that page is curated, and a
 * walkthrough of one listing belongs with the person selling it.
 */
export default function OwnerVideosCard({ kind }: { kind: VideoOwnerKind }) {
  const [videos, setVideos] = useState<OwnerVideo[] | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listOwnerVideos(kind)
      .then((res) => {
        if (active) setVideos(res.data);
      })
      .catch(() => {
        // An account of the wrong kind simply has nothing to show here.
        if (active) setVideos(null);
      });

    return () => {
      active = false;
    };
  }, [kind]);

  useEffect(() => {
    if (!notice && !error) return;
    const t = setTimeout(() => {
      setNotice(null);
      setError(null);
    }, 4000);
    return () => clearTimeout(t);
  }, [notice, error]);

  if (videos === null) return null;

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adding) return;

    setAdding(true);
    setError(null);
    setNotice(null);

    try {
      const res = await createOwnerVideo(kind, {
        title: title.trim(),
        description: description.trim(),
        youtubeUrl: url.trim(),
      });
      setVideos([...videos, res.data]);
      setTitle("");
      setUrl("");
      setDescription("");
      setNotice("Added. It is live on your public page.");
    } catch (err) {
      const e2 = err as Error & { errors?: Record<string, string[]> };
      /* The API names the field; its message is the useful one. */
      setError(
        Object.values(e2.errors ?? {}).flat()[0] ||
          e2.message ||
          "Could not add that video.",
      );
    } finally {
      setAdding(false);
    }
  };

  const remove = async (video: OwnerVideo) => {
    setRemoving(video.id);
    setError(null);
    setNotice(null);

    try {
      await deleteOwnerVideo(kind, video.id);
      setVideos(videos.filter((v) => v.id !== video.id));
      setNotice("Removed.");
    } catch (err) {
      setError((err as Error).message || "Could not remove that video.");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <section className="rounded-lg border border-border bg-white p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-heading">Videos</h2>
      <p className="mt-1 text-[12px] text-muted">
        YouTube videos shown on your public page — a walkthrough, an area
        guide, an introduction. They stay on your page and are not added to
        the site&apos;s video library.
      </p>

      {videos.length > 0 && (
        <ul className="mt-5 space-y-3">
          {videos.map((video) => (
            <li
              key={video.id}
              className="flex items-center gap-3 rounded-md border border-border p-3"
            >
              <SafeImage
                src={video.thumbnail}
                alt={video.title}
                width={96}
                height={54}
                className="h-[54px] w-24 shrink-0 rounded bg-surface object-cover"
                unoptimized
                fallbackText=""
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-heading">
                  {video.title}
                </p>
                {video.description && (
                  <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted">
                    {video.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => void remove(video)}
                disabled={removing === video.id}
                className="shrink-0 text-[11.5px] font-semibold text-red-500 hover:underline disabled:opacity-40"
              >
                {removing === video.id ? "Removing…" : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="mt-5 border-t border-border pt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
              placeholder="e.g. Walkthrough: 10 Marla in Gulberg"
              className={adminInputClass}
            />
          </AdminFormField>

          <AdminFormField label="YouTube link">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://youtu.be/…"
              className={adminInputClass}
            />
          </AdminFormField>
        </div>

        <div className="mt-4">
          <AdminFormField label="Description (optional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder="A line about what the video shows."
              className={adminTextareaClass}
            />
          </AdminFormField>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={adding || !title.trim() || !url.trim()}
            className="h-10 shrink-0 rounded-md bg-primary px-5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {adding ? "Adding…" : "Add video"}
          </button>

          {notice && <span className="text-[12px] text-primary">{notice}</span>}
          {error && <span className="text-[12px] text-red-600">{error}</span>}
        </div>
      </form>
    </section>
  );
}
