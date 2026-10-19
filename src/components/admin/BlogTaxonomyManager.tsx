"use client";

import { useCallback, useEffect, useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { slugify } from "@/lib/api/categories";
import type {
  BlogTaxonomyInput,
  BlogTaxonomyRecord,
} from "@/lib/api/blogTaxonomy";

type BlogTaxonomyManagerProps = {
  /** "Category" or "Tag" — used throughout the copy. */
  noun: string;
  heading: string;
  description: string;
  /** Explains what deleting does, which differs between the two. */
  deleteNote: string;
  load: () => Promise<BlogTaxonomyRecord[]>;
  create: (input: BlogTaxonomyInput) => Promise<BlogTaxonomyRecord>;
  update: (slug: string, input: BlogTaxonomyInput) => Promise<BlogTaxonomyRecord>;
  remove: (slug: string) => Promise<void>;
};

/**
 * Categories and tags are the same record with different rules, so one
 * component serves both rather than duplicating the table and modals.
 */
export default function BlogTaxonomyManager({
  noun,
  heading,
  description,
  deleteNote,
  load,
  create,
  update,
  remove,
}: BlogTaxonomyManagerProps) {
  const [records, setRecords] = useState<BlogTaxonomyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogTaxonomyRecord | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState<BlogTaxonomyRecord | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const lower = noun.toLowerCase();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setRecords(await load());
      setLoadError(null);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Could not load this list.",
      );
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    let active = true;

    /*
     * Loads inline rather than calling refresh(), so the state updates are
     * guarded by `active` — a fast unmount would otherwise set state on a
     * component that is already gone.
     */
    (async () => {
      try {
        const data = await load();
        if (active) {
          setRecords(data);
          setLoadError(null);
        }
      } catch (err) {
        if (active) {
          setLoadError(
            err instanceof Error ? err.message : "Could not load this list.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [load]);

  function openCreate() {
    setEditing(null);
    setName("");
    setSlug("");
    setSlugTouched(false);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(record: BlogTaxonomyRecord) {
    setEditing(record);
    setName(record.name);
    setSlug(record.slug);
    // An existing slug is deliberate; a name edit should not rewrite it.
    setSlugTouched(true);
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Please enter a name.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const input = {
        name: trimmedName,
        slug: (slug || slugify(trimmedName)).trim(),
      };

      if (editing) await update(editing.slug, input);
      else await create(input);

      setFormOpen(false);
      await refresh();
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      const messages = e.errors
        ? Array.from(new Set(Object.values(e.errors).flat()))
        : [];
      setFormError(messages.join(" ") || e.message || "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await remove(deleting.slug);
      setDeleting(null);
      await refresh();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setDeleteBusy(false);
    }
  }

  const filtered = records.filter((record) =>
    (record.name + " " + record.slug)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPosts = records.reduce((sum, record) => sum + record.count, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">{heading}</h1>
          <p className="mt-1 text-[12px] text-gray-500">{description}</p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          + Add New {noun}
        </button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <SummaryCard label={"Total " + noun + "s"} value={records.length} />
        <SummaryCard label="Posts Filed" value={totalPosts} />
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={"Search " + lower + "s..."}
          className="h-10 w-full rounded-md border border-gray-200 px-3 text-[12px] outline-none focus:border-primary"
        />
      </div>

      {loadError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-700">
          {loadError}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <Th>{noun}</Th>
              <Th>Slug</Th>
              <Th center>Posts</Th>
              <Th center>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-[12px] text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-[12px] text-gray-400"
                >
                  No {lower}s found.
                </td>
              </tr>
            ) : (
              filtered.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 text-[12.5px] font-semibold text-gray-900">
                    {record.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11.5px] text-gray-500">
                    {record.slug}
                  </td>
                  <td className="px-4 py-3 text-center text-[12px] text-gray-600">
                    {record.count}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(record)}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleting(record);
                          setDeleteError(null);
                        }}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={(editing ? "Edit " : "Add New ") + noun}
        description={
          editing
            ? "Update the name or slug."
            : "Create a " + lower + " that posts can be filed under."
        }
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
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
              {saving ? "Saving..." : editing ? "Save Changes" : "Create " + noun}
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {formError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium leading-relaxed text-red-700">
              {formError}
            </p>
          )}

          <Field label={noun + " Name"} required>
            <input
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);
                if (!slugTouched) setSlug(slugify(value));
              }}
              placeholder={
                noun === "Tag" ? "e.g. Market Trends" : "e.g. Buying Guide"
              }
              className="h-10 w-full rounded-md border border-gray-200 px-3 text-[12px] outline-none focus:border-primary"
            />
          </Field>

          <Field label="Slug" hint="Used in filter URLs. Lowercase and hyphens only.">
            <input
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              placeholder="auto-generated-from-name"
              className="h-10 w-full rounded-md border border-gray-200 px-3 font-mono text-[12px] outline-none focus:border-primary"
            />
          </Field>
        </div>
      </AdminModal>

      <AdminModal
        open={Boolean(deleting)}
        onClose={() => {
          setDeleting(null);
          setDeleteError(null);
        }}
        title={"Delete " + noun}
        description={
          deleting ? deleting.name + " will be removed." : ""
        }
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setDeleting(null);
                setDeleteError(null);
              }}
              className="inline-flex h-10 items-center rounded-md border border-gray-200 px-5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteBusy}
              className="inline-flex h-10 items-center rounded-md bg-red-600 px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {deleteBusy ? "Deleting..." : "Delete " + noun}
            </button>
          </div>
        }
      >
        <p className="text-[12px] leading-relaxed text-gray-600">
          {deleteNote}
          {deleting && deleting.count > 0 && (
            <>
              {" "}
              <span className="font-semibold text-gray-800">
                {deleting.count}{" "}
                {deleting.count === 1 ? "post uses" : "posts use"}
              </span>{" "}
              it.
            </>
          )}
        </p>

        {deleteError && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium leading-relaxed text-red-700">
            {deleteError}
          </p>
        )}
      </AdminModal>
    </div>
  );
}

function Th({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <th
      className={[
        "px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-600",
        center ? "text-center" : "text-left",
      ].join(" ")}
    >
      {children}
    </th>
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
      <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-[22px] font-bold text-gray-900">{value}</p>
    </div>
  );
}
