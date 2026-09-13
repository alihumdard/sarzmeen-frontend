"use client";

import { useState } from "react";
import {
  CompareIcon,
  EyeCountIcon,
  HeartIcon,
  LocationPinIcon,
  ShareIcon,
  VerifiedTickIcon,
} from "@/components/ui/Icons";
import { formatPostDate } from "@/lib/utils/format";
import type { PropertyDetail } from "@/types/property";

type PropertyDetailHeaderProps = {
  property: PropertyDetail;
};

/**
 * Title block above the gallery: headline, verification, listing meta and the
 * share / save / compare actions.
 *
 * Save and compare are local state in V1 — persisting either needs the API
 * and an account, which are out of scope.
 */
export default function PropertyDetailHeader({
  property,
}: PropertyDetailHeaderProps) {
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(false);

  const { headline, fullLocation, propertyId, listedAgo, views, verified } =
    property;

  const actionClasses =
    "flex items-center gap-2 rounded-md border px-4 py-2.5 text-[12px] font-medium transition-colors";

  async function handleShare() {
    const url = window.location.href;

    // Use the OS share sheet where it exists, otherwise copy the link.
    if (navigator.share) {
      try {
        await navigator.share({ title: headline, url });
        return;
      } catch {
        // Dismissed by the user — fall through to copying instead.
      }
    }

    await navigator.clipboard?.writeText(url);
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="flex flex-wrap items-center gap-2.5 text-[21px] font-bold text-heading sm:text-[24px]">
          {headline}

          {verified && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-primary">
              <VerifiedTickIcon className="h-4 w-4 shrink-0" />
              Verified Property
            </span>
          )}
        </h1>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted">
          <span className="flex items-center gap-1.5">
            <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
            {fullLocation}
          </span>

          <span className="hidden h-3.5 w-px bg-border sm:block" />

          <span>
            Property ID:{" "}
            <span className="font-medium text-heading">{propertyId}</span>
          </span>

          <span className="hidden h-3.5 w-px bg-border sm:block" />

          <span>Listed: {listedAgo ?? formatPostDate(property.listedOn)}</span>

          <span className="hidden h-3.5 w-px bg-border sm:block" />

          <span className="flex items-center gap-1.5">
            <EyeCountIcon className="h-3.5 w-3.5 shrink-0" />
            {views.toLocaleString("en-US")} Views
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleShare}
          className={`${actionClasses} border-border text-heading hover:border-primary hover:text-primary`}
        >
          <ShareIcon className="h-4 w-4" />
          Share
        </button>

        <button
          type="button"
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
          className={`${actionClasses} ${
            saved
              ? "border-danger text-danger"
              : "border-border text-heading hover:border-primary hover:text-primary"
          }`}
        >
          <HeartIcon className="h-4 w-4" filled={saved} />
          {saved ? "Saved" : "Save"}
        </button>

        <button
          type="button"
          aria-pressed={compared}
          onClick={() => setCompared(!compared)}
          className={`${actionClasses} ${
            compared
              ? "border-primary bg-primary-light text-primary"
              : "border-border text-heading hover:border-primary hover:text-primary"
          }`}
        >
          <CompareIcon className="h-4 w-4" />
          Compare
        </button>
      </div>
    </div>
  );
}
