"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import {
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/AdminFormField";
import { slugify } from "@/lib/api/categories";
import type {
  ProjectCategory,
  ProjectCategoryInput,
  ProjectCategoryStatus,
} from "@/types/projectCategory";

type ProjectCategoryFormModalProps = {
  open: boolean;
  onClose: () => void;
  /** Passed when editing; omitted when creating. */
  category?: ProjectCategory | null;
  onSubmit: (input: ProjectCategoryInput) => Promise<void>;
};

const emptyForm: ProjectCategoryInput = {
  name: "",
  slug: "",
  description: "",
  status: "active",
  featured: false,
};

export default function ProjectCategoryFormModal({
  open,
  onClose,
  category,
  onSubmit,
}: ProjectCategoryFormModalProps) {
  const isEdit = Boolean(category);

  // Seeded from props on mount. The parent remounts this component per
  // open via `key`, so there is no effect syncing props into state.
  const [form, setForm] = useState<ProjectCategoryInput>(
    category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description,
          status: category.status,
          featured: category.featured,
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** True once the user types their own slug, so it stops tracking the name. */
  const [slugTouched, setSlugTouched] = useState(Boolean(category));

  const update = <K extends keyof ProjectCategoryInput>(
    key: K,
    value: ProjectCategoryInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        slug: (form.slug || slugify(form.name)).trim(),
        description: form.description.trim(),
      });
      onClose();
    } catch {
      setError("Could not save the category. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Project Category" : "Add New Project Category"}
      description={
        isEdit
          ? "Update this project category's details."
          : "Create a category that projects can be filed under."
      }
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="project-category-form"
            disabled={saving}
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
          </button>
        </div>
      }
    >
      <form
        id="project-category-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-600">
            {error}
          </p>
        )}

        <Field label="Category Name" required>
          <input
            value={form.name}
            onChange={(event) => {
              const name = event.target.value;
              update("name", name);
              if (!slugTouched) update("slug", slugify(name));
            }}
            placeholder="e.g. Mixed-Use Project"
            className={adminInputClass}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Slug" hint="Used in filter URLs.">
            <input
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                update("slug", event.target.value);
              }}
              placeholder="mixed-use-project"
              className={adminInputClass}
            />
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(event) =>
                update("status", event.target.value as ProjectCategoryStatus)
              }
              className={adminSelectClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>

        <Field label="Description">
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="What kind of projects belong in this category?"
            className={adminTextareaClass}
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
          />
          <span className="text-[12px] leading-relaxed text-gray-600">
            Feature this category
            <span className="block text-[11px] text-gray-400">
              Featured categories appear first in project filters.
            </span>
          </span>
        </label>
      </form>
    </AdminModal>
  );
}

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
      <label className="text-[12px] font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
