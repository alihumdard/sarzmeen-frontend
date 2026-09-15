"use client";

import { useState } from "react";
import {
  HeartIcon,
  LocationPinIcon,
  ShareIcon,
  VerifiedTickIcon,
} from "@/components/ui/Icons";
import type { ProjectDetail } from "@/types/project";

type ProjectDetailHeaderProps = {
  project: ProjectDetail;
};

/** Title block above the gallery: name, verification, meta and share/save actions. */
export default function ProjectDetailHeader({
  project,
}: ProjectDetailHeaderProps) {
  const [saved, setSaved] = useState(false);
  const { name, fullLocation, developer, status, verified } = project;

  const actionClasses =
    "flex items-center gap-2 rounded-md border px-4 py-2.5 text-[12px] font-medium transition-colors";

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
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
          {name}

          {verified && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-primary">
              <VerifiedTickIcon className="h-4 w-4 shrink-0" />
              Verified Project
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
            Developer:{" "}
            <span className="font-medium text-heading">{developer}</span>
          </span>

          <span className="hidden h-3.5 w-px bg-border sm:block" />

          <span>
            Status: <span className="font-medium text-heading">{status}</span>
          </span>
        </div>
      </div>

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
      </div>
    </div>
  );
}
