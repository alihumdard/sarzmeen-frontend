"use client";

import { useRef, useState } from "react";
import ImageCropModal from "@/components/admin/ImageCropModal";
import SafeImage from "@/components/ui/SafeImage";
import { api } from "@/lib/api/client";

type Props = {
  label: string;
  /** Current path or URL stored in the setting. */
  value: string;
  onChange: (value: string) => void;
  hint?: string;
};

/**
 * Picks a banner image, with a crop step before it is uploaded.
 *
 * The typed path still works — existing settings point at files in /public —
 * but an image can now be uploaded instead of being placed there by hand.
 */
export default function BannerImageField({
  label,
  value,
  onChange,
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("image", file);

      const res = await api<{ data: { url: string } }>("/admin/banners", {
        method: "POST",
        body,
      });

      onChange(res.data.url);
    } catch (err: unknown) {
      const e = err as Error & { errors?: Record<string, string[]> };
      const first = e.errors ? Object.values(e.errors).flat()[0] : null;
      setError(first || e.message || "Could not upload the image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        {/* Preview doubles as the drop target's thumbnail. */}
        <div className="relative h-[72px] w-[128px] shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          {value ? (
            <SafeImage
              src={value}
              alt=""
              fill
              sizes="128px"
              className="object-cover"
              fallbackText="No image"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
              No image
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/images/hero-home.png"
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <UploadIcon />
              {uploading ? "Uploading..." : "Upload & Crop"}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[11.5px] font-semibold text-gray-500 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>

          {hint && !error && (
            <p className="mt-1.5 text-[10px] text-gray-400">{hint}</p>
          )}

          {error && (
            <p className="mt-1.5 text-[11px] font-medium text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Reset, so picking the same file twice still fires a change.
          event.target.value = "";
          if (file) setPending(file);
        }}
      />

      {pending && (
        <ImageCropModal
          file={pending}
          onCancel={() => setPending(null)}
          onCropped={(cropped) => {
            setPending(null);
            void upload(cropped);
          }}
        />
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
    </svg>
  );
}
