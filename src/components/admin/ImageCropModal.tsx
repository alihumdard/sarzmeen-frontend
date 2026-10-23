"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

/** Presets offered above the crop box; null is free-form. */
const RATIOS: { label: string; value: number | null }[] = [
  { label: "Free", value: null },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
];

/** Mirrors the upload rules, so a crop cannot produce a rejected file. */
const MIN_EDGE = 400;
const MAX_EDGE = 1920;
const MAX_BYTES = 2 * 1024 * 1024;
const QUALITY = 0.85;

type Props = {
  /** The image being edited. */
  file: File;
  onCancel: () => void;
  onCropped: (file: File) => void;
};

/**
 * Crop, zoom and straighten a photo before it is uploaded.
 *
 * Works on the file the lister picked rather than on the stored image, so
 * nothing is uploaded until they are happy with the framing.
 */
export default function ImageCropModal({ file, onCancel, onCropped }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [ratio, setRatio] = useState<number | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * The URL is created inside the effect, not derived during render, because
   * it has to be revoked to avoid a leak — and a revoked URL must be replaced
   * by a fresh one. Deriving it instead leaves the <img> pointing at a URL
   * this effect's own cleanup has already revoked.
   */
  useEffect(() => {
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setArea(pixels);
  }, []);

  async function apply() {
    if (!area || !src) return;

    setBusy(true);
    setError(null);

    try {
      const output = await renderCrop(src, area, rotation, file.name);

      if (output.width < MIN_EDGE || output.height < MIN_EDGE) {
        setError(
          `That crop is ${output.width}×${output.height}px. Each side needs at least ${MIN_EDGE}px — zoom out or select a larger area.`,
        );
        return;
      }

      onCropped(output.file);
    } catch {
      setError("Could not crop this image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 bg-gray-950/60"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="border-b border-gray-200 px-5 py-3.5">
          <h2 className="text-[14px] font-bold text-gray-900">Edit Image</h2>
          <p className="mt-0.5 text-[11.5px] text-gray-500">
            Drag to reposition, scroll or pinch to zoom.
          </p>
        </div>

        {/* The crop surface. Fixed height so the controls stay reachable. */}
        <div className="relative h-[46vh] min-h-[260px] bg-gray-900">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={ratio ?? undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              restrictPosition={false}
            />
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11.5px] font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Ratio
            </span>
            {RATIOS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setRatio(option.value)}
                className={[
                  "rounded-md border px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                  ratio === option.value
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Slider
              label="Zoom"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={setZoom}
              display={`${zoom.toFixed(1)}×`}
            />
            <Slider
              label="Straighten"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={setRotation}
              display={`${rotation}°`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-5 py-3.5">
          <button
            type="button"
            onClick={() => {
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              setRotation(0);
              setRatio(null);
              setError(null);
            }}
            className="text-[11.5px] font-semibold text-gray-500 hover:text-gray-800"
          >
            Reset
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-9 items-center rounded-md border border-gray-200 px-4 text-[12px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={busy || !area}
              className="inline-flex h-9 items-center rounded-md bg-primary px-5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Applying..." : "Apply Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (next: number) => void;
  display: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
        <span className="font-mono text-[11px] normal-case text-gray-400">
          {display}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-primary)]"
      />
    </label>
  );
}

/**
 * Draws the selected area onto a canvas and returns it as a JPEG.
 *
 * Rotation is applied by drawing the whole image onto a square large enough
 * to hold it at any angle, then lifting the crop out of that — otherwise the
 * corners clip as soon as the image is straightened.
 */
async function renderCrop(
  src: string,
  area: Area,
  rotation: number,
  originalName: string,
): Promise<{ file: File; width: number; height: number }> {
  const image = await loadImage(src);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  const radians = (rotation * Math.PI) / 180;
  const box = Math.ceil(
    Math.abs(image.width * Math.cos(radians)) +
      Math.abs(image.height * Math.sin(radians)),
  );
  const boxHeight = Math.ceil(
    Math.abs(image.width * Math.sin(radians)) +
      Math.abs(image.height * Math.cos(radians)),
  );

  canvas.width = box;
  canvas.height = boxHeight;

  ctx.translate(box / 2, boxHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const data = ctx.getImageData(
    Math.round((box - image.width) / 2 + area.x),
    Math.round((boxHeight - image.height) / 2 + area.y),
    Math.round(area.width),
    Math.round(area.height),
  );

  // Keep the crop within the same ceiling the uploader applies.
  const scale = Math.min(1, MAX_EDGE / Math.max(area.width, area.height));
  const width = Math.round(area.width * scale);
  const height = Math.round(area.height * scale);

  const out = document.createElement("canvas");
  const outCtx = out.getContext("2d");
  if (!outCtx) throw new Error("No canvas context");

  if (scale === 1) {
    out.width = data.width;
    out.height = data.height;
    outCtx.putImageData(data, 0, 0);
  } else {
    // putImageData ignores scaling, so go through an intermediate canvas.
    const full = document.createElement("canvas");
    full.width = data.width;
    full.height = data.height;
    full.getContext("2d")?.putImageData(data, 0, 0);

    out.width = width;
    out.height = height;
    outCtx.drawImage(full, 0, 0, width, height);
  }

  const blob = await encode(out, QUALITY);
  const name = originalName.replace(/\.[^.]+$/, "") + ".jpg";

  return {
    file: new File([blob], name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    }),
    width: out.width,
    height: out.height,
  };
}

/** Re-encodes at falling quality until the file fits the upload limit. */
async function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  let current = quality;

  for (let attempt = 0; attempt < 5; attempt++) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", current),
    );

    if (!blob) throw new Error("Could not encode the image");
    if (blob.size <= MAX_BYTES || current <= 0.4) return blob;

    current -= 0.12;
  }

  throw new Error("Could not get this image under the size limit");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the image"));
    image.src = src;
  });
}
