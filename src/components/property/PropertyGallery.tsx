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
  purpose: "sale" | "rent";
};

/** Thumbnails shown before the "+N More Photos" tile. */
const THUMBNAIL_LIMIT = 5;

export default function PropertyGallery({
  images,
  title,
  photoCount,
  featured,
  purpose,
}: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);

  function step(delta: number) {
    setActive((current) => {
      const next = current + delta;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  }

  const thumbnails = images.slice(0, THUMBNAIL_LIMIT);
  const remaining = photoCount - thumbnails.length;

  const arrowClasses =
    "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-heading shadow-md transition-colors hover:bg-white hover:text-primary";

  return (
    <div>
      {/* Main image */}
      <div className="relative h-[280px] overflow-hidden rounded-lg sm:h-[360px] lg:h-[420px]">
        <Image
          src={images[active]}
          alt={`${title} — photo ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 100vw"
          className="object-cover"
        />

        {featured && (
          <span className="pointer-events-none absolute left-4 top-4 z-20 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold text-white">
            Featured
          </span>
        )}

        <span className="pointer-events-none absolute left-[104px] top-4 z-20 rounded-full bg-heading/85 px-3.5 py-1.5 text-[11px] font-semibold text-white">
          {purpose === "sale" ? "For Sale" : "For Rent"}
        </span>

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

        {images.length > 1 && (
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

        <span className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full bg-heading/80 px-3.5 py-1.5 text-[11px] font-medium text-white">
          {active + 1} / {photoCount}
        </span>
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
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
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
