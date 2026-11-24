"use client";

import { useEffect, useMemo, useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import AdminFormField from "@/components/admin/AdminFormField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { listLocations, type Location } from "@/lib/api/locations";
import { listAdminBlogs, type AdminBlog } from "@/lib/api/adminBlogs";
import {
  createSocietyMap,
  getAdminSocietyMap,
  updateSocietyMap,
  type AdminMapInput,
} from "@/lib/api/societyMaps";
import type { SocietyMap } from "@/types/societyMap";

const inputClass =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-[12.5px] outline-none focus:border-primary";

export default function SocietyMapFormModal({
  open,
  map,
  onClose,
  onSaved,
}: {
  open: boolean;
  map: SocietyMap | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(map?.title ?? "");
  const [locationId, setLocationId] = useState<number | null>(
    map?.society ? Number(map.society.id) : null,
  );
  const [locationQuery, setLocationQuery] = useState(map?.society?.name ?? "");
  const [summary, setSummary] = useState(map?.summary ?? "");
  const [description, setDescription] = useState(map?.description ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    map?.publishedAt ? "published" : "draft",
  );
  const [featured, setFeatured] = useState(map?.featured ?? false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [removeDocument, setRemoveDocument] = useState(false);

  const [locations, setLocations] = useState<Location[]>([]);

  /* Blogs shown at the foot of the map's page. Attached by hand rather
     than matched on the society's name, which would file a Karachi post
     under the Lahore society of the same name. */
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [blogIds, setBlogIds] = useState<number[]>(
    (map?.blogs ?? []).map((b) => Number(b.id)),
  );
  const [blogQuery, setBlogQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    listLocations()
      .then(setLocations)
      .catch(() => {
        /* The field then asks for a society that cannot be picked; the
           error below says so when saving fails. */
      });

    listAdminBlogs("per_page=200&status=published")
      .then((res) => setBlogs(res.data))
      .catch(() => {
        /* The blog picker is then empty; the map still saves. */
      });
  }, [open]);

  /* The listing leaves out the write-up, so a map opened from it arrives
     without one. Fetch the full record before the editor can save an
     empty description over a real one. */
  useEffect(() => {
    if (!open || !map || map.description !== undefined) return;

    let active = true;

    getAdminSocietyMap(map.id)
      .then((full) => {
        if (active) setDescription(full.description ?? "");
      })
      .catch(() => {
        if (active) setError("Could not load this map's details.");
      });

    return () => {
      active = false;
    };
  }, [open, map]);

  /* Societies and areas only: a map of a whole city is not what this is
     for, and 3,400 rows unfiltered is not a list anybody can use. */
  const matches = useMemo(() => {
    const term = locationQuery.trim().toLowerCase();
    if (term.length < 2) return [];

    return locations
      .filter(
        (l) =>
          (l.type === "society" || l.type === "area") &&
          l.name.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [locations, locationQuery]);

  const chosen = locations.find((l) => Number(l.id) === locationId) ?? null;

  const blogMatches = useMemo(() => {
    const term = blogQuery.trim().toLowerCase();
    if (term.length < 2) return [];

    return blogs
      .filter(
        (b) =>
          !blogIds.includes(Number(b.id)) &&
          b.title.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [blogs, blogQuery, blogIds]);

  const attached = blogIds
    .map((id) => blogs.find((b) => Number(b.id) === id))
    .filter((b): b is AdminBlog => Boolean(b));

  const save = async () => {
    if (saving) return;

    const missing: string[] = [];
    if (!title.trim()) missing.push("a title");
    if (!locationId) missing.push("a society");
    if (!map && !imageFile) missing.push("a map image");

    if (missing.length > 0 || locationId === null) {
      setError(`Still needed: ${missing.join(", ")}.`);
      return;
    }

    setSaving(true);
    setError(null);

    const input: AdminMapInput = {
      title: title.trim(),
      locationId,
      summary: summary.trim(),
      description,
      status,
      featured,
      blogIds,
      imageFile,
      documentFile,
      removeDocument,
    };

    try {
      if (map) {
        await updateSocietyMap(map.id, input);
      } else {
        await createSocietyMap(input);
      }

      onSaved();
      onClose();
    } catch (err) {
      const e = err as Error & { errors?: Record<string, string[]> };
      setError(
        Object.values(e.errors ?? {}).flat()[0] ||
          e.message ||
          "Could not save that map.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={map ? "Edit Map" : "Add Society Map"}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md px-4 text-[12.5px] font-semibold text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || !title.trim()}
            className="h-10 rounded-md bg-primary px-5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : map ? "Save changes" : "Add map"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField label="Title" required>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              placeholder="Bahria Town Lahore Map"
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField
            label="Society"
            required
            hint={chosen ? `Selected: ${chosen.name}` : "Type at least two letters"}
          >
            <input
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setLocationId(null);
                setError(null);
              }}
              placeholder="Search a society…"
              className={inputClass}
            />

            {matches.length > 0 && !locationId && (
              <ul className="mt-1 max-h-44 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-sm">
                {matches.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationId(Number(l.id));
                        setLocationQuery(l.name);
                        setError(null);
                      }}
                      className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[12px] hover:bg-gray-50"
                    >
                      <span className="truncate text-gray-800">{l.name}</span>
                      <span className="shrink-0 text-[10.5px] uppercase text-gray-400">
                        {l.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </AdminFormField>
        </div>

        <AdminFormField
          label="Map image"
          required={!map}
          hint="PNG or JPG, up to 12MB. Uploaded at full size so it stays readable when zoomed."
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              setImageFile(e.target.files?.[0] ?? null);
              setError(null);
            }}
            className="w-full text-[12px] file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-white"
          />
          {map && !imageFile && (
            <p className="mt-1 text-[11px] text-gray-500">
              Leave empty to keep the current image.
            </p>
          )}
        </AdminFormField>

        <AdminFormField
          label="PDF (optional)"
          hint="If set, the Download button hands over this instead of the image."
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
            className="w-full text-[12px] file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-gray-700"
          />

          {map?.hasDocument && !documentFile && (
            <label className="mt-1.5 flex items-center gap-2 text-[11.5px] text-gray-600">
              <input
                type="checkbox"
                checked={removeDocument}
                onChange={(e) => setRemoveDocument(e.target.checked)}
              />
              Remove the current PDF
            </label>
          )}
        </AdminFormField>

        <AdminFormField label="Summary" hint="One or two lines, shown on the card.">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={500}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-[12.5px] outline-none focus:border-primary"
          />
        </AdminFormField>

        <AdminFormField label="Details" hint="Everything written under the map.">
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Blocks, plot sizes, location, payment plans…"
          />
        </AdminFormField>

        <AdminFormField
          label="Related blogs"
          hint="Shown at the foot of the map's page. Type at least two letters."
        >
          {attached.length > 0 && (
            <ul className="mb-2 flex flex-wrap gap-1.5">
              {attached.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-1.5"
                >
                  <span className="max-w-[220px] truncate text-[11.5px] text-gray-800">
                    {b.title}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setBlogIds(blogIds.filter((id) => id !== Number(b.id)))
                    }
                    aria-label={`Remove ${b.title}`}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}

          <input
            value={blogQuery}
            onChange={(e) => setBlogQuery(e.target.value)}
            placeholder="Search a blog post…"
            className={inputClass}
          />

          {blogMatches.length > 0 && (
            <ul className="mt-1 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-sm">
              {blogMatches.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setBlogIds([...blogIds, Number(b.id)]);
                      setBlogQuery("");
                    }}
                    className="block w-full truncate px-3 py-1.5 text-left text-[12px] text-gray-800 hover:bg-gray-50"
                  >
                    {b.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AdminFormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField label="Status">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published")
              }
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </AdminFormField>

          <AdminFormField label="Featured">
            <label className="flex h-10 items-center gap-2 text-[12.5px] text-gray-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Show this map first
            </label>
          </AdminFormField>
        </div>
      </div>
    </AdminModal>
  );
}
