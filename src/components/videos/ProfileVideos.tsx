"use client";

import { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";

export type ProfileVideo = {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  embedUrl: string;
  thumbnail: string;
};

/**
 * The videos an agent or agency has put on their own page.
 *
 * These never appear in the site's video library, so this is the only
 * place they are seen.
 *
 * One plays in the large frame and the rest are thumbnails beside it.
 * Picking one brings it into the frame and sends the one that was
 * playing back to the list — the thumbnails used to be links to YouTube,
 * which took the viewer off the page they had come to look at.
 *
 * Only the chosen video is embedded. An iframe for each would load them
 * all before anybody asked, which on a phone is the page's whole weight
 * spent on videos nobody clicked.
 */
export default function ProfileVideos({
  videos,
  heading,
}: {
  videos: ProfileVideo[];
  heading: string;
}) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (videos.length === 0) return null;

  const playing = videos.find((v) => v.id === playingId) ?? videos[0];
  const rest = videos.filter((v) => v.id !== playing.id);

  return (
    <section className="bg-white pt-9 pb-12">
      <div className="container-page">
        <h2 className="text-[19px] font-bold text-heading">{heading}</h2>
        <p className="mt-1 text-[13px] text-muted">
          {videos.length === 1 ? "1 video" : `${videos.length} videos`}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                /* Keyed on the video, so picking another replaces the
                   frame rather than leaving the first one playing. */
                key={playing.id}
                src={playing.embedUrl}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <h3 className="mt-3 text-[14px] font-semibold text-heading">
              {playing.title}
            </h3>
            {playing.description && (
              <p className="mt-1 break-words text-[12.5px] leading-relaxed text-muted">
                {playing.description}
              </p>
            )}
          </div>

          {rest.length > 0 && (
            <ul className="flex flex-col gap-3">
              {rest.map((video) => (
                <li key={video.id}>
                  <button
                    type="button"
                    onClick={() => setPlayingId(video.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-border p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-surface"
                  >
                    <span className="relative h-[54px] w-24 shrink-0 overflow-hidden rounded bg-surface">
                      <SafeImage
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                        unoptimized
                        fallbackText=""
                      />
                      {/* A play mark, so a thumbnail reads as something to
                          start rather than a picture. */}
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <svg
                          className="h-5 w-5 text-white drop-shadow"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[12.5px] font-medium text-heading">
                        {video.title}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
