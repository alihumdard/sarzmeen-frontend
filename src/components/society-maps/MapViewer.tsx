"use client";

import { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { recordMapDownload } from "@/lib/api/societyMaps";
import type { SocietyMap } from "@/types/societyMap";

/**
 * The map itself, and the button under it.
 *
 * Reading a society map means reading plot numbers, so the picture opens
 * full size in its own tab where the browser's own zoom works — rather
 * than a lightbox, which would have to reinvent panning and pinching and
 * would do it worse.
 */
export default function MapViewer({ map }: { map: SocietyMap }) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (busy) return;
    setBusy(true);

    try {
      /* Ask the server first so the download is counted; it answers with
         where the file is. */
      const { url, filename } = await recordMapDownload(map.slug);
      triggerDownload(url, filename);
    } catch {
      /* The count is a nicety; never let it stand between a reader and
         the file they asked for. */
      triggerDownload(map.download, `${map.slug}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <a
        href={map.image}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-2xl border border-border bg-white"
        title="Open the full-size map"
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/10]">
          <SafeImage
            src={map.image}
            alt={map.title}
            fill
            sizes="(min-width: 1024px) 860px, 100vw"
            className="object-contain"
            fallbackText="Map unavailable"
          />
        </div>

        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm transition-opacity group-hover:bg-primary">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
          </svg>
          Click to zoom
        </span>
      </a>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={download}
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          {busy ? "Preparing…" : "Download Map"}
        </button>

        <span className="text-[11.5px] text-muted">
          {map.hasDocument ? "PDF" : "High-resolution image"}
        </span>
      </div>
    </div>
  );
}

/**
 * Hand a file to the browser.
 *
 * `download` is only honoured for files from this origin; where the file
 * is served from somewhere else the browser opens it instead, which is
 * still the reader getting their map.
 */
function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.target = "_blank";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
