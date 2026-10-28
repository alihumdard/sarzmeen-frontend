"use client";

import { useState } from "react";
import ImageCropModal from "@/components/admin/ImageCropModal";

type Props = {
  /** URL of the image already stored on the listing. */
  url: string;
  /** Receives the cropped file; the caller uploads it and drops the old one. */
  onCropped: (file: File) => Promise<void> | void;
  className?: string;
};

/**
 * Re-crops an image that has already been uploaded.
 *
 * The cropper works on a File, so the stored image is fetched back into
 * one first. A listing's photos are usually only noticed to be badly
 * framed after they are up, and until now the only remedy was to delete
 * and upload again.
 */
export default function StoredImageEditButton({
  url,
  onCropped,
  className = "",
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(String(res.status));

      const blob = await res.blob();
      const name = url.split("/").pop() || "image.jpg";

      setFile(new File([blob], name, { type: blob.type || "image/jpeg" }));
    } catch {
      setError("Could not open this image for editing.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        disabled={busy}
        title="Crop or straighten"
        aria-label="Edit image"
        className={
          className ||
          "absolute bottom-1 left-1 inline-flex items-center gap-1 rounded bg-gray-900/75 px-1.5 py-0.5 text-[9.5px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-60"
        }
      >
        <CropIcon />
        {busy ? "Opening..." : "Edit"}
      </button>

      {error && (
        <span className="absolute bottom-1 right-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
          {error}
        </span>
      )}

      {file && (
        <ImageCropModal
          file={file}
          onCancel={() => setFile(null)}
          onCropped={async (cropped) => {
            setFile(null);
            await onCropped(cropped);
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
