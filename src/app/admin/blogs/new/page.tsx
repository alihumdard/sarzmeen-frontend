"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import ImageCropModal from "@/components/admin/ImageCropModal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import {
  createAdminBlog,
  getAdminBlog,
  updateAdminBlog,
  type BlogInput,
} from "@/lib/api/adminBlogs";
import { api } from "@/lib/api/client";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });

type Category = { id: string; slug: string; name: string };
type Tag = { id: string; slug: string; name: string };

const emptyForm: BlogInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  featured: false,
  category: "",
  tags: [],
  readTime: 5,
  metaTitle: "",
  metaDescription: "",
  imageFile: null,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<BlogInput>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  /* Held while the cropper is open, before it becomes the chosen file. */
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = useCallback(
    <K extends keyof BlogInput>(key: K, value: BlogInput[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  useEffect(() => {
    api<{ data: Category[] }>("/blog-categories").then((r) => setCategories(r.data)).catch(() => {});
    api<{ data: Tag[] }>("/blog-tags").then((r) => setTags(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    getAdminBlog(editId)
      .then((blog) => {
        setForm({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          status: blog.status,
          featured: blog.featured,
          category: blog.categorySlug || "",
          tags: blog.tags.map((t) => t.slug),
          readTime: blog.readTime,
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          imageFile: null,
        });
        setExistingImage(blog.image || null);
        setSlugManual(true);
        if (blog.metaTitle || blog.metaDescription) setSeoOpen(true);
      })
      .catch(() => setError("Failed to load blog post."))
      .finally(() => setLoading(false));
  }, [editId]);

  function handleTitleChange(title: string) {
    update("title", title);
    if (!slugManual) update("slug", slugify(title));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset, so picking the same file twice still fires a change.
    e.target.value = "";
    if (!file) return;
    setPendingImage(file);
  }

  /* Both the first crop and any later re-crop end up here. */
  function commitImage(file: File) {
    setPendingImage(null);
    update("imageFile", file);
    setImagePreview(URL.createObjectURL(file));
  }

  function toggleTag(slug: string) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(slug)
        ? prev.tags.filter((t) => t !== slug)
        : [...prev.tags, slug],
    }));
  }

  async function save(status?: string) {
    const isDraft = status === "draft";
    if (saving || savingDraft) return;

    const formToSave = status ? { ...form, status } : form;

    if (!formToSave.title.trim() || !formToSave.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    if (formToSave.status === "published" && (!formToSave.excerpt.trim() || !formToSave.content.trim())) {
      setError("Excerpt and content are required to publish.");
      return;
    }

    isDraft ? setSavingDraft(true) : setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEdit && editId) {
        await updateAdminBlog(editId, formToSave);
      } else {
        await createAdminBlog(formToSave);
      }
      if (isEdit) {
        setSuccess(formToSave.status === "published" ? "Blog updated successfully." : "Draft saved successfully.");
        if (status) update("status", formToSave.status);
      } else if (isDraft) {
        setSuccess("Draft saved successfully.");
      } else {
        router.push("/admin/blogs");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save blog post.");
    } finally {
      setSaving(false);
      setSavingDraft(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );
  }

  const displayImage = imagePreview || existingImage;
  const statusLabel = form.status === "published" ? "Published" : form.status === "archived" ? "Archived" : "Draft";
  const statusColor = form.status === "published" ? "bg-green-500" : form.status === "archived" ? "bg-gray-400" : "bg-amber-500";

  return (
    <div className="-mx-2 -mt-2 sm:-mx-4 sm:-mt-4">
      {/* ── Top Action Bar (WordPress-style) ── */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blogs"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Back to blogs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-[14px] font-bold text-gray-900">
                {isEdit ? "Edit Blog" : "Add New Blog"}
              </h1>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <span className={`h-2 w-2 rounded-full ${statusColor}`} />
              <span className="text-[11px] font-medium text-gray-500">{statusLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {form.status !== "published" && (
              <button
                type="button"
                onClick={() => save("draft")}
                disabled={savingDraft || saving}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 px-2.5 text-[11.5px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 sm:px-4 sm:text-[12px]"
              >
                {savingDraft ? <Spinner /> : <DraftIcon />}
                {savingDraft ? "Saving..." : "Save Draft"}
              </button>
            )}
            <button
              type="button"
              onClick={() => window.open(`/blog/${form.slug}`, "_blank")}
              disabled={!form.slug}
              className="hidden h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-4 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 sm:inline-flex"
            >
              <PreviewIcon />
              Preview
            </button>
            <button
              type="button"
              onClick={() => save(isEdit ? form.status : "published")}
              disabled={saving || savingDraft}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-3 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:px-5 sm:text-[12px]"
            >
              {saving ? <Spinner /> : <PublishIcon />}
              {saving ? "Saving..." : isEdit ? "Update Blog" : "Publish Blog"}
            </button>
          </div>
        </div>

        {/* Status messages */}
        {(error || success) && (
          <div className={`border-t px-4 py-2 text-[12px] font-medium sm:px-6 ${error ? "border-red-100 bg-red-50 text-red-600" : "border-green-100 bg-green-50 text-green-600"}`}>
            {error || success}
          </div>
        )}
      </div>

      {/* ── Main Layout ── */}
      <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_300px]">

        {/* Left Column — Content */}
        <div className="min-w-0 space-y-5">
          {/* Title */}
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Add title"
            className="w-full border-0 border-b-2 border-gray-200 bg-transparent pb-3 text-[28px] font-bold text-gray-900 placeholder:text-gray-300 focus:border-primary focus:outline-none sm:text-[32px]"
          />

          {/* Permalink */}
          <div className="flex items-center gap-2 text-[12px]">
            <span className="font-medium text-gray-500">Permalink:</span>
            <span className="text-gray-400">/blog/</span>
            <input
              value={form.slug}
              onChange={(e) => { update("slug", e.target.value); setSlugManual(true); }}
              className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 py-0.5 text-primary transition-colors focus:border-gray-200 focus:bg-white focus:outline-none"
            />
            {slugManual && (
              <button
                type="button"
                onClick={() => { setSlugManual(false); update("slug", slugify(form.title)); }}
                className="text-[11px] font-medium text-gray-400 hover:text-primary"
              >
                Reset
              </button>
            )}
          </div>

          {/* Editor */}
          <RichTextEditor
            value={form.content}
            onChange={(html) => update("content", html)}
            placeholder="Start writing your blog post..."
          />

          {/* Excerpt */}
          <Panel title="Excerpt" subtitle="A short summary displayed on blog cards and search results.">
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="Write a brief summary..."
              className={adminTextareaClass}
              maxLength={500}
            />
            <p className="mt-1 text-right text-[10px] text-gray-400">{form.excerpt.length}/500</p>
          </Panel>

          {/* SEO */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-2">
                <SeoIcon />
                <span className="text-[13px] font-bold text-gray-800">SEO Settings</span>
              </div>
              <svg className={`h-4 w-4 text-gray-400 transition-transform ${seoOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {seoOpen && (
              <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">
                {/* SEO Preview */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-[11px] font-medium text-gray-400 mb-2">Search Engine Preview</p>
                  <p className="text-[16px] font-medium text-[#1a0dab] leading-snug truncate">
                    {form.metaTitle || form.title || "Page Title"}
                  </p>
                  <p className="mt-0.5 text-[12px] text-green-700 truncate">
                    sarzameen.com/blog/{form.slug || "post-slug"}
                  </p>
                  <p className="mt-1 text-[12px] text-gray-500 line-clamp-2 leading-relaxed">
                    {form.metaDescription || form.excerpt || "Add a meta description to see a preview here."}
                  </p>
                </div>

                <Field label="Meta Title" hint="Max 70 characters. Defaults to post title.">
                  <input
                    value={form.metaTitle}
                    onChange={(e) => update("metaTitle", e.target.value)}
                    placeholder={form.title || "Meta title"}
                    className={adminInputClass}
                    maxLength={70}
                  />
                  <CharBar current={form.metaTitle.length} max={70} />
                </Field>

                <Field label="Meta Description" hint="Max 160 characters. Defaults to excerpt.">
                  <textarea
                    rows={2}
                    value={form.metaDescription}
                    onChange={(e) => update("metaDescription", e.target.value)}
                    placeholder="SEO description for search engines..."
                    className={adminTextareaClass}
                    maxLength={160}
                  />
                  <CharBar current={form.metaDescription.length} max={160} />
                </Field>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-[65px] lg:self-start">

          {/* Status & Visibility */}
          <Panel title="Status & Visibility">
            <Field label="Status">
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className={adminSelectClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <div className="mt-3 flex items-center gap-4">
              <Field label="Read Time">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={form.readTime}
                    onChange={(e) => update("readTime", Number(e.target.value))}
                    className={`${adminInputClass} w-20`}
                  />
                  <span className="text-[11px] text-gray-400">min</span>
                </div>
              </Field>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2.5 rounded-lg bg-amber-50 px-3 py-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-3.5 w-3.5 cursor-pointer accent-amber-500"
              />
              <div>
                <span className="text-[12px] font-semibold text-amber-700">Featured Blog</span>
                <p className="text-[10px] text-amber-600/70">Pinned to top on homepage blog section</p>
              </div>
            </label>
          </Panel>

          {/* Featured Image */}
          <Panel title="Featured Image">
            {displayImage ? (
              <>
                <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-100">
                  <SafeImage src={displayImage} alt="Preview" fill sizes="300px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setExistingImage(null); update("imageFile", null); }}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-[10px] text-white hover:bg-black/70"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex-1 rounded-lg border border-gray-200 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Replace Image
                  </button>
                  {/*
                   * Re-cropping needs the file itself, which only exists for an
                   * image chosen in this session; a stored one is replaced.
                   */}
                  {form.imageFile && (
                    <button
                      type="button"
                      onClick={() => setPendingImage(form.imageFile as File)}
                      title="Crop or straighten"
                      className="flex-1 rounded-lg border border-gray-200 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Crop Image
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <UploadIcon />
                <p className="mt-2 text-[11px] font-medium text-gray-600">Click to upload</p>
                <p className="mt-0.5 text-[10px] text-gray-400">JPG, PNG, WebP · Max 2MB · min 400×400px</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {pendingImage && (
              <ImageCropModal
                file={pendingImage}
                onCancel={() => setPendingImage(null)}
                onCropped={commitImage}
              />
            )}
          </Panel>

          {/* Category */}
          <Panel title="Category">
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-gray-50">
                <input
                  type="radio"
                  name="category"
                  checked={form.category === ""}
                  onChange={() => update("category", "")}
                  className="h-3.5 w-3.5 accent-[var(--color-primary)]"
                />
                <span className="text-[12px] text-gray-500">Uncategorized</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    checked={form.category === cat.slug}
                    onChange={() => update("category", cat.slug)}
                    className="h-3.5 w-3.5 accent-[var(--color-primary)]"
                  />
                  <span className={`text-[12px] ${form.category === cat.slug ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </Panel>

          {/* Tags */}
          <Panel title="Tags">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const selected = form.tags.includes(tag.slug);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.slug)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                      selected
                        ? "bg-primary text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {selected && "✓ "}{tag.name}
                  </button>
                );
              })}
            </div>
            {tags.length === 0 && <p className="text-[11px] text-gray-400">No tags available.</p>}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-[13px] font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="mt-0.5 text-[10px] text-gray-400">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="mt-1">{children}</div>
      {hint && <p className="mt-1 text-[10px] text-gray-400">{hint}</p>}
    </div>
  );
}

function CharBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  const color = current > max ? "bg-red-500" : current > max * 0.8 ? "bg-amber-500" : "bg-green-500";
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="h-1 flex-1 rounded-full bg-gray-100">
        <div className={`h-1 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] ${current > max ? "text-red-500" : "text-gray-400"}`}>{current}/{max}</span>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg className="h-7 w-7 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function SeoIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function Spinner() {
  return <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

function DraftIcon() {
  return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
}

function PreviewIcon() {
  return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}

function PublishIcon() {
  return <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
