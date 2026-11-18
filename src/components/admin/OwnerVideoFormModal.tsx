"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import AdminFormField, {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import {
  createOwnerVideo,
  updateOwnerVideo,
  type OwnerVideo,
  type OwnerVideoCategory,
  type VideoOwnerKind,
} from "@/lib/api/ownerVideos";

/**
 * Add or edit one of an owner's videos.
 *
 * The same form either way: the fields are identical, and two of them
 * would drift apart the first time one was changed.
 */
export default function OwnerVideoFormModal({
  kind,
  video,
  categories,
  onClose,
  onSaved,
}: {
  kind: VideoOwnerKind;
  video: OwnerVideo | null;
  categories: OwnerVideoCategory[];
  onClose: () => void;
  onSaved: (video: OwnerVideo, wasNew: boolean) => void;
}) {
  const [title, setTitle] = useState(video?.title ?? "");
  const [url, setUrl] = useState(video?.youtubeUrl ?? "");
  const [link, setLink] = useState(video?.link ?? "");
  const [description, setDescription] = useState(video?.description ?? "");
  const [categoryId, setCategoryId] = useState(video?.categoryId ?? "");
  const [tags, setTags] = useState<string[]>(video?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const tag = tagDraft.trim();
    if (!tag || tags.includes(tag) || tags.length >= 10) {
      setTagDraft("");
      return;
    }
    setTags([...tags, tag]);
    setTagDraft("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    /* A tag left in the box, never committed with Enter, is still one
       the writer meant to add. */
    const pending = tagDraft.trim();
    const allTags = pending && !tags.includes(pending) ? [...tags, pending] : tags;

    const input = {
      title: title.trim(),
      description: description.trim(),
      youtubeUrl: url.trim(),
      link: link.trim() || undefined,
      tags: allTags.length ? allTags : undefined,
      categoryId: categoryId || undefined,
    };

    try {
      const res = video
        ? await updateOwnerVideo(kind, video.id, input)
        : await createOwnerVideo(kind, input);

      onSaved(res.data, !video);
    } catch (err) {
      const e2 = err as Error & { errors?: Record<string, string[]> };
      setError(
        Object.values(e2.errors ?? {}).flat()[0] ||
          e2.message ||
          "Could not save that video.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal
      open
      onClose={onClose}
      title={video ? "Edit Video" : "Add Video"}
      description="Paste a YouTube link — the thumbnail is taken from it automatically."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md px-4 text-[12.5px] font-semibold text-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="owner-video-form"
            disabled={saving || !title.trim() || !url.trim()}
            className="h-10 rounded-md bg-primary px-5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : video ? "Save changes" : "Add video"}
          </button>
        </div>
      }
    >
      <form id="owner-video-form" onSubmit={save} className="space-y-4">
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {error}
          </p>
        )}

        {/* What an edit costs, said before it is made rather than after. */}
        {video?.status === "published" && (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
            Changing the YouTube link or the page it leads to sends this back
            for review. Renaming it does not.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField label="Title" required>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
              placeholder="e.g. Walkthrough: 10 Marla in Gulberg"
              className={adminInputClass}
            />
          </AdminFormField>

          <AdminFormField label="YouTube link" required>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://youtu.be/…"
              className={adminInputClass}
            />
          </AdminFormField>

          <AdminFormField label="Category">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={categories.length === 0}
              className={adminSelectClass}
            >
              <option value="">Uncategorised</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {/* A lone "Uncategorised" in a dropdown looks like something
                failed to load; say where categories come from instead. */}
            {categories.length === 0 && (
              <p className="mt-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-800">
                You have no categories yet. Close this and use{" "}
                <span className="font-semibold">Categories &rarr; Manage</span>{" "}
                above the list to add one, then it will appear here.
              </p>
            )}
          </AdminFormField>

          <AdminFormField label="Link (optional)">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://… the listing this is about"
              className={adminInputClass}
            />
          </AdminFormField>
        </div>

        <AdminFormField label="Tags (optional)">
          <input
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              /* Enter commits the tag rather than submitting the form,
                 which would save the video half-filled. */
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            onBlur={addTag}
            disabled={tags.length >= 10}
            placeholder={tags.length >= 10 ? "Ten is the most" : "Type and press Enter"}
            className={adminInputClass}
          />
        </AdminFormField>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-primary"
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

        <AdminFormField label="Description (optional)">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="A line about what the video shows."
            className={adminTextareaClass}
          />
        </AdminFormField>
      </form>
    </AdminModal>
  );
}
