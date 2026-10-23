"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import SafeImage from "@/components/ui/SafeImage";
import { slugify } from "@/lib/api/categories";
import { createVideo, updateVideo } from "@/lib/api/videos";
import type { Video, VideoInput } from "@/types/video";

type VideoFormModalProps = {
  open: boolean;
  onClose: () => void;
  /** Null when adding. */
  video: Video | null;
  onSaved: () => void;
};

/**
 * Pulls the id out of a YouTube link so the thumbnail can be previewed
 * before saving. Mirrors the parser on the server, which is what actually
 * decides whether the link is accepted.
 */
function youtubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return /^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null;
}

export default function VideoFormModal({
  open,
  onClose,
  video,
  onSaved,
}: VideoFormModalProps) {
  const isEdit = Boolean(video);

  const [title, setTitle] = useState(video?.title ?? "");
  const [slug, setSlug] = useState(video?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(video));
  const [url, setUrl] = useState(video?.youtubeUrl ?? "");
  const [description, setDescription] = useState(video?.description ?? "");
  const [status, setStatus] = useState(video?.status ?? "draft");
  const [featured, setFeatured] = useState(video?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(String(video?.sortOrder ?? 0));
  const [metaTitle, setMetaTitle] = useState(video?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    video?.metaDescription ?? "",
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewId = youtubeId(url);

  async function handleSave() {
    if (!title.trim() || !url.trim()) {
      setError("A title and a YouTube link are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const input: VideoInput = {
        title: title.trim(),
        slug: (slug || slugify(title)).trim(),
        description: description.trim(),
        youtubeUrl: url.trim(),
        status: status as VideoInput["status"],
        featured,
        sortOrder: Number(sortOrder) || 0,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
      };

      if (video) await updateVideo(video.id, input);
      else await createVideo(input);

      onSaved();
      onClose();
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      const messages = e.errors
        ? Array.from(new Set(Object.values(e.errors).flat()))
        : [];
      setError(messages.join(" ") || e.message || "Could not save the video.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Video" : "Add New Video"}
      description="Paste a YouTube link — the thumbnail is taken from it automatically."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Video"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium leading-relaxed text-red-700">
            {error}
          </p>
        )}

        <Field label="YouTube Link" required hint="A watch, share, embed or shorts link all work.">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={inputClass}
          />
        </Field>

        {/* Immediate confirmation that the link was understood. */}
        {previewId && (
          <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
            <div className="relative h-[54px] w-[96px] shrink-0 overflow-hidden rounded">
              <SafeImage
                src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                fallbackText="—"
              />
            </div>
            <p className="text-[11.5px] text-gray-600">
              Thumbnail taken from YouTube.
              <br />
              <span className="font-mono text-[11px] text-gray-400">
                {previewId}
              </span>
            </p>
          </div>
        )}

        <Field label="Title" required>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            placeholder="e.g. How to verify property documents"
            className={inputClass}
          />
        </Field>

        <Field label="Permalink" hint="Used in the page address.">
          <input
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            placeholder="auto-generated-from-title"
            className={`${inputClass} font-mono`}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value.slice(0, 5000))}
            rows={4}
            placeholder="What this video covers..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-[12px] outline-none focus:border-primary"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Status">
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as VideoInput["status"])
              }
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>

          <Field label="Order" hint="Lower shows first.">
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Featured">
            <label className="flex h-10 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
              />
              <span className="text-[12px] text-gray-600">Show first</span>
            </label>
          </Field>
        </div>

        <details className="rounded-md border border-gray-200 p-3">
          <summary className="cursor-pointer text-[12px] font-semibold text-gray-700">
            SEO (optional)
          </summary>

          <div className="mt-3 flex flex-col gap-4">
            <Field label="Meta Title" hint="Up to 70 characters.">
              <input
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Meta Description" hint="Up to 160 characters.">
              <input
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </details>
      </div>
    </AdminModal>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-[12px] outline-none focus:border-primary";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
