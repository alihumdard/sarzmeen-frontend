"use client";

import { useEffect, useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SafeImage from "@/components/ui/SafeImage";
import { slugify } from "@/lib/api/categories";
import {
  createVideo,
  listVideoCategories,
  updateVideo,
  type AdminVideoCategory,
} from "@/lib/api/videos";
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
  const [categoryId, setCategoryId] = useState(video?.categoryId ?? "");
  const [tags, setTags] = useState<string[]>(video?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [categories, setCategories] = useState<AdminVideoCategory[]>([]);

  useEffect(() => {
    let active = true;

    listVideoCategories()
      .then((res) => {
        if (active) setCategories(res.data);
      })
      .catch(() => {
        /* The dropdown simply stays empty; the form still works. */
      });

    return () => {
      active = false;
    };
  }, []);

  const addTag = () => {
    const tag = tagDraft.trim();
    if (!tag || tags.includes(tag) || tags.length >= 10) {
      setTagDraft("");
      return;
    }
    setTags([...tags, tag]);
    setTagDraft("");
  };
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
        /* A tag left in the box, never committed with Enter, is still
           one the writer meant to add. */
        tags: (() => {
          const pending = tagDraft.trim();
          return pending && !tags.includes(pending) ? [...tags, pending] : tags;
        })(),
        categoryId: categoryId || undefined,
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
      setError(messages.join(" ") || e.message || "Could not save the guide.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Guide" : "Add New Guide"}
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
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Guide"}
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
            placeholder="e.g. How to add a new property listing"
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
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="What this guide covers, step by step..."
            maxLength={5000}
            minHeightClass="min-h-[160px]"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Category"
            hint={
              categories.length === 0
                ? "Add categories from the Categories panel."
                : undefined
            }
          >
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={categories.length === 0}
              className={inputClass}
            >
              <option value="">Uncategorised</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tags" hint="Type and press Enter. Shown to nobody — they are for search.">
            <input
              value={tagDraft}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={(event) => {
                /* Enter commits the tag rather than submitting the form,
                   which would save the video half-filled. */
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag();
                }
              }}
              onBlur={addTag}
              disabled={tags.length >= 10}
              placeholder={tags.length >= 10 ? "Ten is the most" : "e.g. DHA"}
              className={inputClass}
            />
          </Field>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  aria-label={`Remove ${tag}`}
                  className="text-primary/60 transition-colors hover:text-primary"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

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
