"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  fallbackText?: string;
};

export default function SafeImage({ fallbackText, alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[11px] font-medium text-gray-400">
        {fallbackText || alt?.charAt(0)?.toUpperCase() || "—"}
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
