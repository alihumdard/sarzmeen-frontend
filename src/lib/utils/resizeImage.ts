/** Longest edge a listing photo is stored at. */
const MAX_EDGE = 1920;

/** Below this, a photo is too small to show well on a detail page. */
const MIN_EDGE = 400;

/** JPEG quality for the re-encoded file. */
const QUALITY = 0.82;

/** Server limit per image, mirrored here so the check happens before upload. */
const MAX_BYTES = 5 * 1024 * 1024;

export type ImageRejection = {
  file: File;
  reason: string;
};

export type PreparedImages = {
  files: File[];
  rejected: ImageRejection[];
};

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image."));
    };

    img.src = url;
  });
}

/**
 * Shrinks a photo to MAX_EDGE and re-encodes it as JPEG.
 *
 * A phone camera produces 4000px files of several megabytes. Nothing on the
 * site displays an image larger than about 1600px, so sending the original
 * wastes the visitor's bandwidth and runs into the upload limit for no gain.
 */
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

  // Already small enough, and not heavy: leave it untouched rather than
  // re-encoding and losing quality for nothing.
  if (scale === 1 && file.size <= MAX_BYTES) {
    bitmap.close();
    return file;
  }

  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );

  if (!blob) return file;

  // Keep the original if re-encoding somehow made it bigger.
  if (blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
}

/**
 * Checks and resizes photos before they are uploaded.
 *
 * Returns the files to send alongside any that were rejected, so the form can
 * say which photo was refused and why instead of failing the whole save.
 */
export async function prepareImages(files: File[]): Promise<PreparedImages> {
  const prepared: File[] = [];
  const rejected: ImageRejection[] = [];

  for (const file of files) {
    try {
      const { width, height } = await readDimensions(file);

      if (width < MIN_EDGE || height < MIN_EDGE) {
        rejected.push({
          file,
          reason: `too small (${width}×${height}px — needs at least ${MIN_EDGE}px on each side)`,
        });
        continue;
      }

      const out = await shrink(file);

      if (out.size > MAX_BYTES) {
        rejected.push({
          file,
          reason: `still ${(out.size / 1024 / 1024).toFixed(1)}MB after resizing — please use a smaller photo`,
        });
        continue;
      }

      prepared.push(out);
    } catch {
      rejected.push({ file, reason: "could not be read as an image" });
    }
  }

  return { files: prepared, rejected };
}
