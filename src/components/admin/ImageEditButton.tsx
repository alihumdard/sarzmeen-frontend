"use client";

import { useState } from "react";
import ImageCropModal from "@/components/admin/ImageCropModal";

type Props = {
  file: File;
  /** Receives the cropped file, to swap in place of the original. */
  onEdited: (file: File) => void;
  className?: string;
};

/**
 * The per-thumbnail "Edit" affordance.
 *
 * Owns the crop modal so each image grid only has to drop this in, rather
 * than every form repeating the open/close state.
 */
export default function ImageEditButton({
  file,
  onEdited,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Crop or straighten"
        aria-label="Edit image"
        className={
          className ||
          "absolute bottom-1 left-1 inline-flex items-center gap-1 rounded bg-gray-900/75 px-1.5 py-0.5 text-[9.5px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
        }
      >
        <CropIcon />
        Edit
      </button>

      {open && (
        <ImageCropModal
          file={file}
          onCancel={() => setOpen(false)}
          onCropped={(cropped) => {
            onEdited(cropped);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function CropIcon() {
  return (
    <svg
      className="h-2.5 w-2.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M2 6h14a2 2 0 0 1 2 2v14" />
    </svg>
  );
}
