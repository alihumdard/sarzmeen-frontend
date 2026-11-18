"use client";

import { useState } from "react";
import {
  createOwnerVideoCategory,
  deleteOwnerVideoCategory,
  renameOwnerVideoCategory,
  type OwnerVideoCategory,
  type VideoOwnerKind,
} from "@/lib/api/ownerVideos";

/**
 * The groupings an owner made for their own videos.
 *
 * Collapsed by default: most of the time somebody is here to add a
 * video, not to reorganise, and an open panel of chips pushes the videos
 * themselves below the fold.
 */
export default function OwnerVideoCategories({
  kind,
  categories,
  onChange,
}: {
  kind: VideoOwnerKind;
  categories: OwnerVideoCategory[];
  onChange: (categories: OwnerVideoCategory[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const fail = (err: unknown, fallback: string) => {
    const e = err as Error & { errors?: Record<string, string[]> };
    setError(Object.values(e.errors ?? {}).flat()[0] || e.message || fallback);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = draft.trim();
    if (!name || busy) return;

    setBusy(true);
    setError(null);

    try {
      const res = await createOwnerVideoCategory(kind, name);
      onChange([...categories, res.data]);
      setDraft("");
    } catch (err) {
      fail(err, "Could not add that category.");
    } finally {
      setBusy(false);
    }
  };

  const rename = async (id: string) => {
    const name = editingName.trim();
    if (!name) {
      setEditingId(null);
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const res = await renameOwnerVideoCategory(kind, id, name);
      onChange(categories.map((c) => (c.id === id ? res.data : c)));
      setEditingId(null);
    } catch (err) {
      fail(err, "Could not rename that category.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (category: OwnerVideoCategory) => {
    setBusy(true);
    setError(null);

    try {
      await deleteOwnerVideoCategory(kind, category.id);
      onChange(categories.filter((c) => c.id !== category.id));
    } catch (err) {
      fail(err, "Could not remove that category.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
      >
        <span className="text-[13px] font-semibold text-gray-800">
          Categories
          <span className="ml-2 text-[11.5px] font-normal text-gray-400">
            {categories.length === 0
              ? "none yet"
              : categories.length === 1
                ? "1 category"
                : `${categories.length} categories`}
          </span>
        </span>
        <span className="text-[11.5px] font-semibold text-primary">
          {open ? "Hide" : "Manage"}
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-[12px] text-gray-500">
            Group your videos however suits your work. Removing a category
            keeps its videos.
          </p>

          {error && (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {error}
            </p>
          )}

          {categories.length > 0 && (
            <ul className="mt-4 space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center gap-2 rounded-md border border-gray-100 px-3 py-2"
                >
                  {editingId === category.id ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void rename(category.id);
                        }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={() => void rename(category.id)}
                      maxLength={80}
                      className="h-8 min-w-0 flex-1 rounded border border-gray-200 px-2 text-[12.5px] outline-none focus:border-primary"
                    />
                  ) : (
                    <>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] text-gray-800">
                        {category.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-gray-400">
                        {category.videoCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(category.id);
                          setEditingName(category.name);
                        }}
                        className="shrink-0 text-[11.5px] font-semibold text-primary hover:underline"
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(category)}
                        disabled={busy}
                        className="shrink-0 text-[11.5px] font-semibold text-red-500 hover:underline disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={add} className="mt-4 flex flex-wrap items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={80}
              placeholder="e.g. Walkthroughs"
              className="h-9 min-w-0 flex-1 rounded-md border border-gray-200 px-3 text-[12.5px] outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              className="h-9 shrink-0 rounded-md bg-primary px-4 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
