"use client";

import { useEffect, useRef, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import {
  getAgencyProfile,
  updateAgencyProfile,
  type AgencyProfile,
} from "@/lib/api/agencyProfile";

/**
 * The agency's logo, shown on its public page.
 *
 * The column and the page that displays it both existed, but nothing could
 * ever set it, so every agency showed its initial in a grey circle with no
 * way to replace it.
 */
export default function AgencyLogoCard() {
  const [agency, setAgency] = useState<AgencyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [savingAbout, setSavingAbout] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    getAgencyProfile()
      .then((res) => {
        if (!active) return;
        setAgency(res.data);
        setDescription(res.data.description ?? "");
      })
      .catch(() => {
        // An account with no agency record simply has nothing to show here.
        if (active) setAgency(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /*
   * The preview URL is derived from the chosen file, so it is built where
   * the file is chosen rather than mirrored into state by an effect. The
   * effect is left only to revoke the URL once it is no longer shown.
   */
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const save = async () => {
    if (!file || saving) return;

    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const res = await updateAgencyProfile({ logo: file });
      setAgency(res.data);
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setNotice("Logo updated. It is live on your agency page.");
    } catch (err) {
      setError((err as Error).message || "Could not upload that logo.");
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingAbout) return;

    setSavingAbout(true);
    setError(null);
    setNotice(null);
    try {
      const res = await updateAgencyProfile({ description });
      setAgency(res.data);
      setNotice("Your description is live on your agency page.");
    } catch (err) {
      setError((err as Error).message || "Could not save that description.");
    } finally {
      setSavingAbout(false);
    }
  };

  if (loading || !agency) return null;

  const shown = preview || agency.logo;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-800">Agency logo</h3>
      <p className="mt-1 text-[12px] text-gray-500">
        Shown on your public agency page and next to your listings.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {shown ? (
            <SafeImage
              src={shown}
              alt={agency.name}
              width={80}
              height={80}
              className="h-20 w-20 object-cover"
              unoptimized={Boolean(preview)}
            />
          ) : (
            <span className="text-[22px] font-bold text-gray-400">
              {agency.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const chosen = e.target.files?.[0] ?? null;
              setFile(chosen);
              setPreview(chosen ? URL.createObjectURL(chosen) : null);
              setNotice(null);
              setError(null);
            }}
            className="block w-full text-[12px] text-gray-500 file:mr-3 file:rounded-md file:border file:border-gray-200 file:bg-gray-50 file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-gray-700"
          />
          <p className="mt-1 text-[11px] text-gray-400">
            JPG, PNG or WEBP, up to 2 MB. A square image works best.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void save()}
          disabled={!file || saving}
          className="h-10 shrink-0 rounded-md bg-primary px-5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "Uploading..." : "Save logo"}
        </button>
      </div>

      {notice && (
        <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-700">
          {notice}
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {error}
        </p>
      )}

      {/* The API already accepted a description; nothing on the site could
          send it, so the paragraph on the public page stayed empty. */}
      <form onSubmit={saveAbout} className="mt-6 border-t border-gray-200 pt-5">
        <h3 className="text-sm font-semibold text-gray-800">About the agency</h3>
        <p className="mt-1 text-[12px] text-gray-500">
          The paragraph buyers read at the top of your agency page.
        </p>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="Who you are, the areas you cover, what you are known for."
          className="mt-3 w-full rounded-md border border-gray-200 px-3 py-2 text-[12.5px] text-gray-800 outline-none transition-colors focus:border-primary"
        />
        <p className="mt-1 text-[10.5px] text-gray-400">
          {description.trim().length} / 5000
        </p>

        <button
          type="submit"
          disabled={savingAbout}
          className="mt-3 h-10 rounded-md bg-primary px-5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {savingAbout ? "Saving…" : "Save description"}
        </button>
      </form>
    </section>
  );
}
