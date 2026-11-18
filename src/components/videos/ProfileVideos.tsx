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
  link?: string | null;
  category?: { id: string; name: string; slug: string } | null;
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
  const [category, setCategory] = useState<string>("all");

  if (videos.length === 0) return null;

  /* The categories these videos actually fall under, in the order they
     first appear — an owner's grouping, not an alphabetical list. */
  const categories: { id: string; name: string }[] = [];
  for (const video of videos) {
    if (video.category && !categories.some((c) => c.id === video.category!.id)) {
      categories.push({ id: video.category.id, name: video.category.name });
    }
  }

  const shown =
    category === "all"
      ? videos
      : videos.filter((v) => v.category?.id === category);

  const playing =
    shown.find((v) => v.id === playingId) ?? shown[0] ?? videos[0];

  return (
    <section className="bg-white pt-9 pb-12">
      <div className="container-page">
        <h2 className="text-[19px] font-bold text-heading">{heading}</h2>
        <p className="mt-1 text-[13px] text-muted">
          {videos.length === 1 ? "1 video" : `${videos.length} videos`}
        </p>

        {categories.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {[{ id: "all", name: "All" }, ...categories].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCategory(tab.id);
                  /* Let the first of the new set take the frame rather
                     than leaving one playing that is no longer listed. */
                  setPlayingId(null);
                }}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  category === tab.id
                    ? "bg-primary text-white"
                    : "bg-surface text-muted hover:text-heading"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}

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

            {playing.link && (
              /* rel on an outbound link the owner typed: it is not the
                 site vouching for wherever it goes. */
              <a
                href={playing.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
              >
                Open the listing
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            )}
          </div>

          {shown.length > 1 && (
            <ul className="flex flex-col gap-3">
              {shown.map((video) => {
                /* The whole list stays, with the one playing marked:
                   lifting it out left nothing to show which was on, and
                   the list shuffled under the hand on every pick. */
                const isPlaying = video.id === playing.id;

                return (
                <li key={video.id}>
                  <button
                    type="button"
                    onClick={() => setPlayingId(video.id)}
                    aria-current={isPlaying ? "true" : undefined}
                    className={[
                      "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
                      isPlaying
                        ? "border-primary bg-primary-light/40"
                        : "border-border hover:border-primary/40 hover:bg-surface",
                    ].join(" ")}
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
                      <span
                        className={[
                          "absolute inset-0 flex items-center justify-center",
                          isPlaying ? "bg-primary/35" : "bg-black/25",
                        ].join(" ")}
                      >
                        <svg
                          className="h-5 w-5 text-white drop-shadow"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          {isPlaying ? (
                            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                          ) : (
                            <path d="M8 5v14l11-7z" />
                          )}
                        </svg>
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={[
                          "line-clamp-2 text-[12.5px]",
                          isPlaying
                            ? "font-semibold text-primary"
                            : "font-medium text-heading",
                        ].join(" ")}
                      >
                        {video.title}
                      </span>
                      {isPlaying && (
                        <span className="mt-0.5 block text-[10.5px] font-medium text-primary/70">
                          Now playing
                        </span>
                      )}
                    </span>
                  </button>
                </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
