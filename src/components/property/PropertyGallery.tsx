"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
} from "@/components/ui/Icons";

type PropertyGalleryProps = {
  images: string[];
  title: string;
  /** Total photos on the listing, which can exceed the loaded slides. */
  photoCount: number;
  featured: boolean;
  /**
   * Second badge next to Featured, e.g. "For Sale" on a property or a
   * project's status ("Under Construction"). Omit to hide the badge.
   */
  statusLabel?: string;
};

/** Thumbnails shown before the "+N More Photos" tile. */
const THUMBNAIL_LIMIT = 5;

/**
 * Photo gallery shared by the property and project detail pages — same
 * layout and interactions, with only the second badge's text varying by
 * caller.
 */
export default function PropertyGallery({
  images,
  title,
  photoCount,
  featured,
  statusLabel,
}: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);

  /*
   * A listing can have no photos at all, and the API returns "" for an image
   * whose file is missing. Passing either to next/image throws, so drop them
   * and fall back to a placeholder.
   */
  const usableImages = images.filter((src) => typeof src === "string" && src.trim() !== "");

  function step(delta: number) {
    setActive((current) => {
      if (usableImages.length === 0) return 0;
      const next = current + delta;
      if (next < 0) return usableImages.length - 1;
      if (next >= usableImages.length) return 0;
      return next;
    });
  }
  const mainImage = usableImages[active] ?? usableImages[0];

  const thumbnails = usableImages.slice(0, THUMBNAIL_LIMIT);
  const remaining = Math.max(0, photoCount - thumbnails.length);

  const arrowClasses =
    "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-heading shadow-md transition-colors hover:bg-white hover:text-primary";

  return (
    <div>
      {/* Main image */}
      <div className="relative h-[280px] overflow-hidden rounded-lg sm:h-[360px] lg:h-[420px]">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`${title} — photo ${active + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface text-muted">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <p className="text-[12px]">No photos yet</p>
          </div>
        )}

        {featured && (
          <span className="pointer-events-none absolute left-4 top-4 z-20 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold text-white">
            Featured
          </span>
        )}

        {statusLabel && (
          <span
            className={`pointer-events-none absolute top-4 z-20 rounded-full bg-heading/85 px-3.5 py-1.5 text-[11px] font-semibold text-white ${
              featured ? "left-[104px]" : "left-4"
            }`}
          >
            {statusLabel}
          </span>
        )}

        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save property"}
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
          className={`absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white ${
            saved ? "text-danger" : "text-muted hover:text-danger"
          }`}
        >
          <HeartIcon className="h-4 w-4" filled={saved} />
        </button>

        {usableImages.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => step(-1)}
              className={`${arrowClasses} left-4`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="Next photo"
              onClick={() => step(1)}
              className={`${arrowClasses} right-4`}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </>
        )}

        {/* "1 / 0" is meaningless on a listing with no photos. */}
        {usableImages.length > 0 && (
          <span className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full bg-heading/80 px-3.5 py-1.5 text-[11px] font-medium text-white">
            {active + 1} / {photoCount}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {thumbnails.map((image, index) => (
          <li key={index}>
            <button
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={`relative block h-[64px] w-full overflow-hidden rounded-md border-2 transition-colors sm:h-[72px] ${
                index === active ? "border-primary" : "border-transparent"
              }`}
            >
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">No Image</div>
              )}
            </button>
          </li>
        ))}

        {remaining > 0 && (
          <li>
            <button
              type="button"
              className="flex h-[64px] w-full flex-col items-center justify-center rounded-md bg-heading text-white transition-opacity hover:opacity-90 sm:h-[72px]"
            >
              <span className="text-[15px] font-bold">+{remaining}</span>
              <span className="text-[10px] text-white/80">More Photos</span>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
